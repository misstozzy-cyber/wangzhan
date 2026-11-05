# -*- coding: utf-8 -*-
"""
TYRIA LIGHTING Automated Asset & Specification Extractor
Extracts structured product data (products.json), photometric index (ies_library.json),
catalog metadata (catalogs.json), factory/certificate images, and WebP product visuals
directly from F:\\TYRIA\\TYRIA.
"""

import os
import re
import json
import shutil
import io
import pymupdf
from PIL import Image, ImageStat

SOURCE_ROOT = r"F:\TYRIA\TYRIA"
PROJECT_ROOT = r"c:\Users\30882\Desktop\网站"
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "public")
DATA_DIR = os.path.join(PROJECT_ROOT, "src", "data")

ASSETS_PRODUCTS_DIR = os.path.join(PUBLIC_DIR, "assets", "products")
ASSETS_FACTORY_DIR = os.path.join(PUBLIC_DIR, "assets", "factory")
ASSETS_CERTS_DIR = os.path.join(PUBLIC_DIR, "assets", "certs")
DOWNLOADS_DATASHEETS_DIR = os.path.join(PUBLIC_DIR, "downloads", "datasheets")
DOWNLOADS_CATALOGS_DIR = os.path.join(PUBLIC_DIR, "downloads", "catalogs")
DOWNLOADS_PHOTOMETRIC_DIR = os.path.join(PUBLIC_DIR, "downloads", "photometric")

for d in [
    DATA_DIR,
    ASSETS_PRODUCTS_DIR,
    ASSETS_FACTORY_DIR,
    ASSETS_CERTS_DIR,
    DOWNLOADS_DATASHEETS_DIR,
    DOWNLOADS_CATALOGS_DIR,
    DOWNLOADS_PHOTOMETRIC_DIR,
]:
    os.makedirs(d, exist_ok=True)


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def save_pil_as_webp(img: Image.Image, out_path: str, max_dim: int = 960, quality: int = 84):
    if img.mode in ("CMYK", "P"):
        img = img.convert("RGB")
    elif img.mode == "RGBA":
        bg = Image.new("RGB", img.size, (7, 8, 11))
        bg.paste(img, mask=img.split()[3])
        img = bg
    w, h = img.size
    if max(w, h) > max_dim:
        scale = max_dim / float(max(w, h))
        img = img.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.Resampling.LANCZOS)
    img.save(out_path, "WEBP", quality=quality, method=4)


def extract_pdf_visuals(doc: pymupdf.Document, prod_slug: str) -> dict:
    """
    Extracts:
    - hero.webp: The high-res product photo from Page 1 (prefers the 4167x4167 square product photo)
    - section.webp: Rendered Page 2 (specifications + cross-section drawing)
    - curve.webp: Rendered Page 3 (light distribution curve + parameter table)
    - details: Rendered accessory / wiring / installation pages
    """
    out_folder = os.path.join(ASSETS_PRODUCTS_DIR, prod_slug)
    os.makedirs(out_folder, exist_ok=True)

    hero_rel = f"/assets/products/{prod_slug}/hero.webp"
    section_rel = f"/assets/products/{prod_slug}/section.webp"
    curve_rel = f"/assets/products/{prod_slug}/curve.webp"
    detail_rels = []

    hero_out = os.path.join(out_folder, "hero.webp")
    section_out = os.path.join(out_folder, "section.webp")
    curve_out = os.path.join(out_folder, "curve.webp")

    # 1. Extract Hero Photo from Page 1
    if not os.path.exists(hero_out) and len(doc) > 0:
        p0 = doc[0]
        imgs = p0.get_images(full=True)
        chosen_bytes = None
        best_score = -1
        for img_info in imgs:
            xref = img_info[0]
            try:
                extracted = doc.extract_image(xref)
                w, h = extracted["width"], extracted["height"]
                if w < 500 or h < 400:
                    continue
                pil_check = Image.open(io.BytesIO(extracted["image"])).convert("RGB")
                mean_luma = sum(ImageStat.Stat(pil_check).mean) / 3.0
                if mean_luma < 155 and (w * h) > best_score:
                    best_score = w * h
                    chosen_bytes = extracted["image"]
            except Exception:
                continue

        if chosen_bytes:
            try:
                pil_img = Image.open(io.BytesIO(chosen_bytes))
                save_pil_as_webp(pil_img, hero_out, max_dim=900, quality=85)
            except Exception:
                chosen_bytes = None

        if not os.path.exists(hero_out):
            pix = p0.get_pixmap(dpi=110)
            pil_img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            save_pil_as_webp(pil_img, hero_out, max_dim=900, quality=85)

    # 2. Render Page 2 (Cross-section & key electrical specs)
    if len(doc) > 1 and not os.path.exists(section_out):
        pix = doc[1].get_pixmap(dpi=120)
        pil_img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        save_pil_as_webp(pil_img, section_out, max_dim=1100, quality=84)
    elif len(doc) == 1:
        section_rel = hero_rel

    # 3. Render Page 3 (Light distribution curve & parameter table)
    if len(doc) > 2 and not os.path.exists(curve_out):
        pix = doc[2].get_pixmap(dpi=120)
        pil_img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        save_pil_as_webp(pil_img, curve_out, max_dim=1100, quality=84)
    else:
        curve_rel = section_rel

    # 4. Render up to 3 accessory / wiring / installation pages
    candidate_pages = []
    if len(doc) >= 8:
        candidate_pages = [5, 7, min(12, len(doc) - 2)]
    elif len(doc) >= 5:
        candidate_pages = [3, 4]

    for idx, pno in enumerate(candidate_pages):
        if pno < len(doc):
            d_name = f"detail_{idx + 1}.webp"
            d_out = os.path.join(out_folder, d_name)
            if not os.path.exists(d_out):
                pix = doc[pno].get_pixmap(dpi=105)
                pil_img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                save_pil_as_webp(pil_img, d_out, max_dim=1000, quality=82)
            detail_rels.append(f"/assets/products/{prod_slug}/{d_name}")

    return {
        "hero": hero_rel,
        "section": section_rel,
        "curve": curve_rel,
        "detail": detail_rels,
    }


def infer_dimensions_and_view(rel_dir: str, filename: str, full_text: str):
    """
    Accurately infers cross-section width & height (in mm), view type, and min bend radius (in mm).
    """
    rel_upper = rel_dir.upper()
    fn_upper = filename.upper()

    # Default values
    w, h = 16.0, 15.0
    view = "TV"
    min_bend_diameter = 120

    # Check 360 Round
    m_round = re.search(r"R(13|25|40)", fn_upper + " " + rel_upper)
    if "360" in rel_upper or m_round:
        d = float(m_round.group(1)) if m_round else 25.0
        w, h = d, d
        view = "360"
        min_bend_diameter = 120 if d <= 15 else (200 if d <= 25 else 300)
    elif "D16" in fn_upper or "D16" in rel_upper:
        w, h = 16.0, 16.0
        view = "Dome"
        min_bend_diameter = 120
    else:
        # Look for 4-digit neon profile code e.g. 0306, 0408, 0606, 0612, 0808, 0817, 1010, 1018, 1023, 1212, 1220, 1225, 1607, 1612, 1615, 1617, 2016, 2020, 2210, 2222, 2621, 3020, 3032, 5025
        m_code = re.search(
            r"(0306|0408|0606|0612|0808|0817|1010|1018|1023|1212|1220|1225|1607|1612|1615|1617|2016|2020|2210|2222|2621|3020|3032|5025)",
            fn_upper + " " + rel_upper,
        )
        if m_code:
            code = m_code.group(1)
            w = float(int(code[:2]))
            h = float(int(code[2:]))

    # Determine view category
    if "FLEX LED SHEET" in rel_upper:
        view = "Sheet"
        w, h = 490.0, 245.0
        min_bend_diameter = 30
    elif "FLEX LED STRIP" in rel_upper:
        view = "COB" if "COB" in rel_upper or "COB" in fn_upper else "Strip"
        m_w = re.search(r"W(03|04|05|08|10|12|14|20|32)", fn_upper)
        if m_w:
            w = float(int(m_w.group(1)))
        elif "4MM" in fn_upper:
            w = 4.0
        elif "10MM" in fn_upper:
            w = 10.0
        elif "12MM" in fn_upper:
            w = 12.0
        else:
            w = 10.0
        h = 2.2 if view == "COB" else 1.8
        min_bend_diameter = 30
    elif "WALL GRAZE" in rel_upper:
        view = "Grazer"
        if "2621" in fn_upper or "2621" in rel_upper:
            w, h = 26.0, 21.0
            min_bend_diameter = 200
        elif "1615" in fn_upper or "1615" in rel_upper:
            w, h = 16.0, 15.0
            min_bend_diameter = 160
        else:
            w, h = 18.0, 14.0
            min_bend_diameter = 150
    else:
        # LED NEON FLEX sub-views
        if "360" in rel_upper:
            view = "360"
        elif "3D" in rel_upper or "N3D" in fn_upper:
            view = "3D"
        elif "DOME" in rel_upper:
            view = "Dome"
        elif "DUAL" in rel_upper:
            view = "Dual"
        elif "EMBEDDED" in rel_upper or "RECESSED" in rel_upper:
            view = "Embedded"
        elif "ANTI-GLARE" in rel_upper or "UGR" in fn_upper:
            view = "Anti-Glare"
        elif "CORNER" in fn_upper:
            view = "Corner"
        elif "\\SV" in rel_upper or " SV" in rel_upper or "TY-NS" in fn_upper or "PUNS" in fn_upper:
            view = "SV"
        else:
            view = "TV"

        # Parse min bending diameter from text if present
        m_bend = re.search(r"≥\s*(\d{2,3})\s*mm", full_text)
        if m_bend:
            min_bend_diameter = int(m_bend.group(1))
        else:
            if max(w, h) <= 8:
                min_bend_diameter = 60
            elif max(w, h) <= 12:
                min_bend_diameter = 120
            elif max(w, h) <= 17:
                min_bend_diameter = 160 if view == "TV" else 120
            elif max(w, h) <= 22:
                min_bend_diameter = 200
            else:
                min_bend_diameter = 300

    min_bend_radius = max(15, int(round(min_bend_diameter / 2.0)))
    return {"w": w, "h": h}, view, min_bend_radius, min_bend_diameter


def parse_series_and_family(rel_dir: str, filename: str):
    parts = rel_dir.split(os.sep)
    top = parts[0].upper()

    if "LED NEON FLEX" in top:
        family = "LED Neon Flex"
        family_slug = "neon-flex"
        sub = parts[1] if len(parts) > 1 else "TV"
        sub_u = sub.upper()
        if sub_u == "TV":
            series = "Top View (TV)"
            series_slug = "top-view"
        elif sub_u == "SV":
            series = "Side View (SV)"
            series_slug = "side-view"
        elif "360" in sub_u:
            series = "360° Round"
            series_slug = "360-round"
        elif "3D" in sub_u:
            series = "3D Bend"
            series_slug = "3d-bend"
        elif "DOME" in sub_u:
            series = "Dome Neon"
            series_slug = "dome"
        elif "DUAL" in sub_u:
            series = "Dual-Side"
            series_slug = "dual-side"
        elif "EMBEDDED" in sub_u:
            series = "Embedded & Recessed"
            series_slug = "embedded-recessed"
        elif "ANTI-GLARE" in sub_u:
            series = "Anti-Glare UGR<19"
            series_slug = "anti-glare"
        elif "IP68 PU" in sub_u:
            series = "IP68 PU Neon"
            series_slug = "ip68-pu"
        elif "IP68 SILICONE" in sub_u:
            series = "IP68 Silicone"
            series_slug = "ip68-silicone"
        elif "BLACK" in sub_u:
            series = "Black Neon"
            series_slug = "black-neon"
        elif "AC230V" in sub_u:
            series = "AC230V Neon"
            series_slug = "ac230v-neon"
        else:
            series = sub
            series_slug = slugify(sub)
    elif "FLEX LED STRIP" in top:
        family = "LED Strip"
        family_slug = "led-strip"
        sub = parts[1] if len(parts) > 1 else "SMD2835"
        sub_u = sub.upper()
        if "160LM" in sub_u:
            series = "High Efficiency 160lm/W"
            series_slug = "high-efficiency"
        elif "2010" in sub_u:
            series = "SMD2010 Ultra-Narrow"
            series_slug = "smd2010"
        elif "2835" in sub_u:
            series = "SMD2835 Architectural"
            series_slug = "smd2835"
        elif "CCT" in sub_u:
            series = "CCT Tunable White"
            series_slug = "cct-tunable"
        elif "COB" in sub_u:
            series = "COB & COB PLUS"
            series_slug = "cob-strip"
        elif "FULL SPECTRUM" in sub_u:
            series = "Full Spectrum Ra98"
            series_slug = "full-spectrum"
        elif "RGB+CCT" in sub_u:
            series = "RGB+CCT 5-in-1"
            series_slug = "rgb-cct"
        elif "RGBW" in sub_u:
            series = "RGBW 4-in-1"
            series_slug = "rgbw"
        elif "SAUNA" in sub_u:
            series = "Sauna High-Temp"
            series_slug = "sauna-strip"
        else:
            series = sub
            series_slug = slugify(sub)
    elif "FLEX LED SHEET" in top:
        family = "Flex LED Sheet"
        family_slug = "led-sheet"
        series = "Flexible Backlit LED Sheet"
        series_slug = "backlit-sheet"
    else:
        family = "Flexible Wall Grazer"
        family_slug = "wall-grazer"
        sub = parts[1] if len(parts) > 1 else "2621"
        if "1615" in sub:
            series = "Silicone Wall Grazer 1615"
            series_slug = "grazer-1615"
        elif "2621" in sub:
            series = "Silicone Wall Grazer 2621 Pro"
            series_slug = "grazer-2621-pro"
        else:
            series = "PU DMX512 Wall Grazer"
            series_slug = "grazer-pu"

    return family, family_slug, series, series_slug


def scan_photometric_files_in_folder(folder_path: str, prod_slug: str):
    """
    Finds all .IES, .ldt, and test report .pdf files inside a product folder's 'IES file' or 'Testing report' subtrees.
    Copies up to 8 representative files to public/downloads/photometric/<prod_slug>/ so links work directly.
    """
    ies_entries = []
    ldt_entries = []
    report_entries = []

    if not os.path.exists(folder_path):
        return ies_entries, ldt_entries, report_entries

    dest_dir = os.path.join(DOWNLOADS_PHOTOMETRIC_DIR, prod_slug)

    for root, dirs, files in os.walk(folder_path):
        rel_sub = os.path.relpath(root, folder_path)
        if rel_sub == ".":
            continue
        ies_f = [f for f in files if f.lower().endswith(".ies")]
        ldt_f = [f for f in files if f.lower().endswith(".ldt")]
        pdf_f = [f for f in files if f.lower().endswith(".pdf")]

        # Prefer English report if available
        en_pdfs = [f for f in pdf_f if "-en" in f.lower()]
        chosen_pdf = en_pdfs[0] if en_pdfs else (pdf_f[0] if pdf_f else None)

        if ies_f or ldt_f or chosen_pdf:
            os.makedirs(dest_dir, exist_ok=True)
            folder_label = os.path.basename(root)
            # Extract CCT & Wattage from folder_label or filename
            sample_name = ies_f[0] if ies_f else (ldt_f[0] if ldt_f else chosen_pdf)
            m_cct = re.search(r"(\d{4}(?:\+\d{4})?K|RGBW?|RED|GREEN|BLUE)", sample_name.upper())
            cct_val = m_cct.group(1) if m_cct else "3000K"
            m_watt = re.search(r"(\d+(?:\.\d+)?)W", sample_name.upper())
            watt_val = f"{m_watt.group(1)}W/m" if m_watt else "10W/m"

            ies_url = None
            ldt_url = None
            rep_url = None

            if ies_f:
                src_ies = os.path.join(root, ies_f[0])
                dst_ies = os.path.join(dest_dir, ies_f[0])
                if not os.path.exists(dst_ies):
                    shutil.copy2(src_ies, dst_ies)
                ies_url = f"/downloads/photometric/{prod_slug}/{ies_f[0]}"
                ies_entries.append({
                    "label": folder_label,
                    "filename": ies_f[0],
                    "cct": cct_val,
                    "watt": watt_val,
                    "url": ies_url,
                })

            if ldt_f:
                src_ldt = os.path.join(root, ldt_f[0])
                dst_ldt = os.path.join(dest_dir, ldt_f[0])
                if not os.path.exists(dst_ldt):
                    shutil.copy2(src_ldt, dst_ldt)
                ldt_url = f"/downloads/photometric/{prod_slug}/{ldt_f[0]}"
                ldt_entries.append({
                    "label": folder_label,
                    "filename": ldt_f[0],
                    "cct": cct_val,
                    "watt": watt_val,
                    "url": ldt_url,
                })

            if chosen_pdf:
                src_rep = os.path.join(root, chosen_pdf)
                dst_rep = os.path.join(dest_dir, chosen_pdf)
                if not os.path.exists(dst_rep):
                    shutil.copy2(src_rep, dst_rep)
                rep_url = f"/downloads/photometric/{prod_slug}/{chosen_pdf}"
                report_entries.append({
                    "label": folder_label,
                    "filename": chosen_pdf,
                    "cct": cct_val,
                    "watt": watt_val,
                    "url": rep_url,
                })

    return ies_entries, ldt_entries, report_entries


def extract_factory_and_cert_assets():
    """
    Extracts real factory, laboratory, and certificate images from
    Catalogue of Silicone Led neon_TYRIA LIGHTING-V2.pdf (Pages 4, 5, 6, 7).
    """
    neon_cat = os.path.join(SOURCE_ROOT, "目录", "Catalogue of Silicone Led neon_TYRIA LIGHTING-V2.pdf")
    if not os.path.exists(neon_cat):
        return [], []

    doc = pymupdf.open(neon_cat)
    factory_imgs = []
    cert_imgs = []

    # Render full overview pages 4, 5, 6, 7 and extract key embedded photos
    page_configs = [
        (3, "enterprise_profile.webp", "11,000 m² Manufacturing Base & R&D Center"),
        (4, "rd_smd_packaging.webp", "In-House SMD Packaging & Optical Engineering Team"),
        (5, "laboratory_workshops.webp", "CNAS-Grade Photometric Lab & 6 Silicone Co-Extrusion Lines"),
        (6, "certificates_wall.webp", "International Compliance & Quality Management Certifications"),
    ]
    for p_idx, fname, caption in page_configs:
        if p_idx < len(doc):
            out_p = os.path.join(ASSETS_FACTORY_DIR, fname)
            if not os.path.exists(out_p):
                pix = doc[p_idx].get_pixmap(dpi=150)
                pil_img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                save_pil_as_webp(pil_img, out_p, max_dim=1600, quality=86)
            factory_imgs.append({"id": fname.replace(".webp", ""), "title": caption, "image": f"/assets/factory/{fname}"})

    # Extract individual embedded workshop & lab photos from Pages 4, 5, 6 (indices 3, 4, 5)
    lab_titles = [
        "Automated SMD Packaging Line",
        "High-Speed SMT Production Line",
        "Silicone Co-Extrusion Workshop (6 Lines)",
        "IES Goniophotometer Darkroom Lab",
        "Integrating Sphere Spectroradiometer",
        "IPX8 Pressurized Immersion Tank",
        "IP3–IP6 Integrated Waterproof Chamber",
        "Salt Spray Corrosion Test Chamber",
        "UV Weathering & Anti-Yellowing Chamber",
        "Microcomputer Tensile Strength Tester",
        "2D Optical Coordinate Measuring System",
        "Programmable Temp & Humidity Chamber",
        "Transportation Vibration Test Platform",
        "LED Strip Automated Production Workshop",
    ]
    extracted_count = 0
    for p_idx in [3, 4, 5]:
        if p_idx >= len(doc):
            continue
        for img_info in doc[p_idx].get_images(full=True):
            xref = img_info[0]
            try:
                ext = doc.extract_image(xref)
                w, h = ext["width"], ext["height"]
                if w >= 220 and h >= 150 and w < 4000:
                    fname = f"lab_facility_{extracted_count + 1:02d}.webp"
                    out_p = os.path.join(ASSETS_FACTORY_DIR, fname)
                    if not os.path.exists(out_p):
                        pil_img = Image.open(io.BytesIO(ext["image"]))
                        save_pil_as_webp(pil_img, out_p, max_dim=800, quality=85)
                    title = lab_titles[extracted_count] if extracted_count < len(lab_titles) else f"Quality Testing Facility #{extracted_count + 1}"
                    factory_imgs.append({"id": f"facility-{extracted_count+1}", "title": title, "image": f"/assets/factory/{fname}"})
                    extracted_count += 1
            except Exception:
                continue

    # Extract individual certificate images from Page 7 (index 6)
    cert_labels = [
        "ISO 9001:2015 Quality Management",
        "ISO 14001:2015 Environmental Management",
        "ISO 45001:2018 Occupational Health & Safety",
        "ETL Listed (Intertek North America)",
        "TUV Rheinland CE Compliance",
        "UKCA Conformity Assessment",
        "RCM Australia & New Zealand Compliance",
        "RoHS 2.0 Hazardous Substances Report",
        "LM-80 50,000-Hour Lumen Maintenance",
        "ErP Energy Efficiency Directive",
        "IP68 Pressurized Waterproof Verification",
        "UV & Salt Mist Resistance Certificate",
    ]
    c_count = 0
    if len(doc) > 6:
        for img_info in doc[6].get_images(full=True):
            xref = img_info[0]
            try:
                ext = doc.extract_image(xref)
                w, h = ext["width"], ext["height"]
                if w >= 180 and h >= 220 and w < 3500:
                    fname = f"cert_{c_count + 1:02d}.webp"
                    out_p = os.path.join(ASSETS_CERTS_DIR, fname)
                    if not os.path.exists(out_p):
                        pil_img = Image.open(io.BytesIO(ext["image"]))
                        save_pil_as_webp(pil_img, out_p, max_dim=900, quality=86)
                    label = cert_labels[c_count] if c_count < len(cert_labels) else f"International Compliance Certificate #{c_count + 1}"
                    cert_imgs.append({"id": f"cert-{c_count+1}", "title": label, "image": f"/assets/certs/{fname}"})
                    c_count += 1
            except Exception:
                continue

    return factory_imgs, cert_imgs


def build_product_name(rel_dir: str, filename: str, item_no: str, series: str, size: dict) -> str:
    base_dir_name = os.path.basename(rel_dir)
    fn_clean = filename.replace(".pdf", "").replace(".PDF", "")

    if "LED NEON FLEX" in rel_dir.upper():
        if "Anti-glare" in rel_dir:
            if "HWUGR" in fn_clean:
                return "1617 TV Honeycomb Anti-Glare"
            m = re.search(r"(NS1617|NT1010|NT1617|NT2222)", fn_clean)
            code = m.group(1).replace("NS", "").replace("NT", "") + (" SV" if "NS" in m.group(1) else " TV") if m else fn_clean
            return f"{code} Anti-Glare UGR<19"
        if "IP68 Silicone" in rel_dir:
            if "In-ground" in fn_clean:
                return "1617 SV In-Ground IP68"
            m = re.search(r"(NS1220|NT1615|NT1617)", fn_clean)
            if m:
                c = m.group(1)
                return f"{c[2:]} {'SV' if 'NS' in c else 'TV'} IP68 Silicone"
        if "BLACK" in rel_dir.upper():
            return "1615 TV Matte Black Neon"
        if "Corner" in fn_clean:
            return "2210 TV Corner Neon"
        if "3D 1617" in fn_clean or "N3D1617" in fn_clean:
            return "3D 1617 Dual-Bend"
        if "1615HV" in fn_clean:
            return "1615 TV High-Efficacy"
        return base_dir_name

    if "FLEX LED SHEET" in rel_dir.upper():
        if "UCS2904" in fn_clean:
            return "LED Sheet 800LEDs RGBW Pixel (UCS2904)"
        if "Crgbw" in fn_clean:
            return "LED Sheet 800LEDs RGBW 4-in-1"
        if "Ca" in fn_clean:
            return "LED Sheet 784LEDs CCT Tunable"
        return "LED Sheet 392LEDs Single Color"

    if "LED Wall Graze" in rel_dir:
        if "1615" in fn_clean:
            return "1615 Flexible Wall Grazer 15W"
        if "2621Pro-CV" in fn_clean:
            return "2621 Pro Wall Grazer (Constant Voltage)"
        if "Crgbw" in fn_clean:
            return "2621 Pro RGBW Wall Grazer 18W"
        if "CCx" in fn_clean and "2621" in fn_clean:
            return "2621 Pro Wall Grazer 24W (Constant Current)"
        if "2621" in fn_clean:
            return "2621 Pro Wall Grazer 24W"
        if "WL35Q36" in fn_clean and "P8" not in fn_clean:
            return "PU 3535 RGB DMX512 Wall Grazer"
        if "WLT28Q48" in fn_clean:
            return "PU Tilt 2835 18W Wall Grazer"
        if "WLT35Q36" in fn_clean:
            return "PU Tilt 3535 DMX512 Wall Grazer"
        return "PU Tilt 3535 RGB Wall Grazer"

    # FLEX LED STRIP
    if "COB" in rel_dir.upper():
        if "WS2814" in fn_clean:
            return "COB Addressable 896LEDs RGBW (WS2814)"
        if "WS2811" in fn_clean:
            return "COB Addressable 840LEDs RGB (WS2811)"
        if "576" in fn_clean:
            return "COB 576LEDs CCT Tunable 10mm"
        if "480VxW04" in fn_clean:
            return "COB Ultra-Slim 4mm 480LEDs"
        if "COB PLUS" in fn_clean:
            return "COB PLUS Integrated Series (8/10/12/14mm)"
        return fn_clean
    if "Full Spectrum" in rel_dir:
        return "Full Spectrum Ra98 120LEDs (Dual-Chip)" if "Two" in fn_clean else "Full Spectrum Ra98 120LEDs (Single-Chip)"
    if "Sauna" in rel_dir:
        return "Sauna High-Temp RGBW Strip (100°C)" if "rgbw" in fn_clean.lower() else "Sauna High-Temp Single Color Strip (100°C)"

    return fn_clean


def main():
    print("Starting TYRIA LIGHTING asset & specification extraction...")
    products = []
    all_ies_records = []

    # Deduplicate versioned PDFs in the same folder
    skip_exact_files = {
        "TY-N3D1615V24Px-Cx.pdf",        # superseded by TY-N3D1615V24Px-Cx-ver.3.3.pdf
        "TY-NS1018V24Px-Cx.pdf",         # superseded by TY-NS1018V24Px-Cx V3.5.pdf
        "TY-NS1615V24Px-Cx.pdf",         # superseded by TY-NS1615V24Px-Cx 3.2.pdf
        "TY-NT1615HV24Px-Cx.ver.3.2.pdf",# superseded by TY-NT1615HV24Px-Cx.ver.4.3.pdf
        "TY-NT1617V24Px-Cx_2.2.pdf",     # duplicate of TY-NT1617V24Px-Cx.pdf
        "TY-NT2020V24Px-Cx.pdf",         # superseded by TY-NT2020V24Px-Cx ver.3.7.pdf
        "24V COB 480LEDs 4mm.pdf",       # duplicate of TY-STCOBQ480VxW04P5-Cx.pdf
    }

    for root, dirs, files in os.walk(SOURCE_ROOT):
        rel_dir = os.path.relpath(root, SOURCE_ROOT)
        rel_lower = rel_dir.lower()
        if (
            "ies file" in rel_lower
            or "testing report" in rel_lower
            or "test report" in rel_lower
            or "目录" in rel_lower
            or "1212-a 3000k" in rel_lower
        ):
            continue

        pdfs = sorted([f for f in files if f.lower().endswith(".pdf")])
        for pdf_file in pdfs:
            if pdf_file in skip_exact_files:
                continue

            full_pdf_path = os.path.join(root, pdf_file)
            family, family_slug, series, series_slug = parse_series_and_family(rel_dir, pdf_file)

            # Open PDF and extract text
            try:
                doc = pymupdf.open(full_pdf_path)
            except Exception as e:
                print(f"Error opening {full_pdf_path}: {e}")
                continue

            full_text = ""
            for p_idx in range(min(6, len(doc))):
                full_text += "\n" + doc[p_idx].get_text("text")

            # Clean itemNo
            item_no = pdf_file[:-4]
            item_no = re.sub(r"(\s+V\d+\.\d+|\s+ver\.\d+\.\d+|\.ver\.\d+\.\d+|_2\.2)$", "", item_no, flags=re.IGNORECASE).strip()

            size, view, min_bend_radius, min_bend_diameter = infer_dimensions_and_view(rel_dir, pdf_file, full_text)
            model_name = build_product_name(rel_dir, pdf_file, item_no, series, size)
            prod_slug = slugify(f"{family_slug}-{model_name}-{item_no[:14]}")

            # Copy datasheet PDF to public/downloads/datasheets/
            safe_pdf_name = f"{prod_slug}.pdf"
            dst_pdf = os.path.join(DOWNLOADS_DATASHEETS_DIR, safe_pdf_name)
            if not os.path.exists(dst_pdf):
                shutil.copy2(full_pdf_path, dst_pdf)
            datasheet_url = f"/downloads/datasheets/{safe_pdf_name}"

            # Extract WebP visuals
            visuals = extract_pdf_visuals(doc, prod_slug)

            # Scan IES / LDT / Test reports in this folder
            ies_list, ldt_list, report_list = scan_photometric_files_in_folder(root, prod_slug)
            for entry in ies_list:
                all_ies_records.append({
                    **entry,
                    "productId": prod_slug,
                    "model": model_name,
                    "itemNo": item_no,
                    "family": family,
                    "series": series,
                })

            # Parse Voltage
            if "AC230" in item_no.upper() or "AC230" in rel_dir.upper():
                voltage = "AC230V"
            elif "48V" in full_text.upper():
                voltage = "DC48V"
            elif "12V" in item_no.upper() or "VX" in item_no.upper():
                voltage = "DC12V / DC24V"
            elif "V5" in item_no.upper():
                voltage = "DC5V / DC24V"
            else:
                voltage = "DC24V"

            # Parse Wattage options
            watt_options = []
            m_watts = re.findall(r"\b(3|4|5|6|8|10|11|12|14|15|16|18|19|20|22|24|25|30|32)\s*w/m\b", full_text, flags=re.IGNORECASE)
            for w_str in m_watts:
                w_num = int(w_str)
                if w_num not in watt_options:
                    watt_options.append(w_num)
            m_item_p = re.search(r"P(\d{1,2})\b", item_no)
            if m_item_p:
                p_num = int(m_item_p.group(1))
                if p_num not in watt_options and 1 <= p_num <= 95:
                    watt_options.append(p_num)
            if not watt_options:
                watt_options = [5, 10, 15] if family == "LED Neon Flex" else [10, 15, 20]
            watt_options = sorted(watt_options)

            # Parse CCT & Control Options
            cct_options = []
            controls = []
            text_u = (full_text + " " + item_no).upper()
            if "1600K-12000K" in text_u:
                cct_options = ["1600K", "1800K", "2200K", "2700K", "3000K", "4000K", "5000K", "6500K", "12000K"]
                controls = ["Full-CCT Tunable", "DMX512", "DALI"]
            else:
                for k in ["1800K", "2100K", "2400K", "2700K", "3000K", "3500K", "4000K", "5000K", "6000K", "6500K"]:
                    if k[:-1] in text_u:
                        cct_options.append(k)
                if not cct_options and ("CX" in text_u or "C30" in text_u or "C40" in text_u):
                    cct_options = ["2700K", "3000K", "3500K", "4000K", "5000K", "6500K"]
                if "Single Color" in full_text or "CX" in text_u or "C30" in text_u:
                    controls.append("Single Color")
                if "TUNABLE" in text_u or "2700+6500" in text_u or "-CA" in text_u:
                    if "Tunable White" not in cct_options:
                        cct_options.append("2700K–6500K")
                    controls.append("Tunable White")
                if "RGB" in text_u:
                    if "RGB" not in cct_options:
                        cct_options.append("RGB")
                    controls.append("RGB")
                if "RGBW" in text_u:
                    if "RGBW" not in cct_options:
                        cct_options.append("RGBW")
                    controls.append("RGBW")
                if "DMX512" in text_u or "UCS512" in text_u:
                    controls.append("DMX512")
                if "SPI" in text_u or "WS281" in text_u or "UCS2904" in text_u:
                    controls.append("SPI Pixel")
                if not controls:
                    controls = ["Single Color", "PWM / 0-10V / DALI"]
                if not cct_options:
                    cct_options = ["2700K", "3000K", "4000K", "6500K"]

            # Parse IP Rating
            if "IP68" in text_u:
                ip_rating = "IP68"
            elif "IP67" in text_u:
                ip_rating = "IP67"
            elif "IP65" in text_u:
                ip_rating = "IP20 / IP65 / IP67" if family == "LED Strip" else "IP65"
            else:
                ip_rating = "IP67" if family == "LED Neon Flex" else "IP20 / IP65"

            # Parse CRI, Efficacy, Cut Unit, Max Run, Warranty
            cri = "Ra≥98" if "FULL SPECTRUM" in text_u else ("Ra≥90" if "90" in text_u else "Ra≥80")
            efficacy = 170 if "-HE" in item_no.upper() or "160LM" in rel_dir.upper() else (110 if family == "LED Strip" else 82)
            max_lumen = int(max(watt_options) * efficacy)
            cut_unit = "Free-Cut" if "FREE" in text_u else ("50mm" if family == "LED Neon Flex" else "33.3mm / 50mm")
            max_run = "50m" if voltage == "AC230V" else ("30m" if "30M" in text_u and family == "LED Neon Flex" else "5m / 10m")
            warranty = "5 Years" if "5 YEARS" in text_u or family == "LED Neon Flex" else "3–5 Years"

            # Parse LED Type & Density
            m_leds = re.search(r"Q(\d{2,3})|(\d{2,3})\s*LEDs", item_no + " " + pdf_file, flags=re.IGNORECASE)
            leds_per_m = int(m_leds.group(1) or m_leds.group(2)) if m_leds else (140 if family == "LED Neon Flex" else 160)
            led_type = "COB Flip-Chip" if "COB" in text_u else ("SMD2010" if "ST20" in item_no else ("SMD5050" if "50" in item_no else "SMD2835"))

            # Build concise engineering pitch & features
            if family == "LED Neon Flex":
                pitch = f"{int(size['w'])}×{int(size['h'])}mm {series} architectural silicone neon with Dow SILASTIC™ co-extrusion, SDCM ≤ 3, and {min_bend_diameter}mm min. bending diameter."
                features = [
                    "Dow SILASTIC™ ET-7021 optical-grade silicone co-extrusion — UV, salt mist, and solvent resistant",
                    f"True {view} light emission with uniform dot-free diffusion and SDCM ≤ 3 (1 Bin)",
                    f"Minimum bending diameter ≥ {min_bend_diameter}mm (Radius {min_bend_radius}mm) without dark spots",
                    f"{ip_rating} ingress protection, customizable production runs up to 30m, 5-year warranty",
                ]
            elif family == "Flexible Wall Grazer":
                pitch = f"{int(size['w'])}×{int(size['h'])}mm flexible architectural wall grazer with precision optical lenses (15°/30°/50°/20×55°) for curved facades."
                features = [
                    "Patented optical lens array: 15° / 30° / 50° / 20×35° / 20×55° beam angles for deep facade grazing",
                    "Flexible body conforms seamlessly to curved building exteriors, arches, and columns",
                    "Dow SILASTIC™ / optical PU encapsulation rated IP65/IP67 for harsh outdoor environments",
                    "Available in Single Color, Tunable White, RGBW, and DMX512 pixel control",
                ]
            elif family == "Flex LED Sheet":
                pitch = f"490×245mm ultra-thin cuttable backlit LED sheet ({leds_per_m} LEDs/sheet) for marble, onyx, and tension-fabric lightboxes."
                features = [
                    "Arbitrary-shape cuttable grid along horizontal, vertical, and 45° diagonal cut lines",
                    "Plug-and-play onboard poke-in connectors for rapid large-area backlighting",
                    "High CRI Ra≥90 with 1-Bin consistency for uniform stone and acrylic illumination",
                    "Available in Single Color, CCT Tunable, RGBW, and UCS2904 addressable pixel versions",
                ]
            else:
                pitch = f"{int(size['w'])}mm {series} architectural flexible LED strip ({leds_per_m} LEDs/m, {cri}, {efficacy} lm/W) on 2oz/3oz rolled copper FPC."
                features = [
                    f"High-density {leds_per_m} LEDs/m {led_type} array delivering up to {efficacy} lm/W efficacy",
                    "Double-layer 2oz/3oz rolled copper FPC for superior thermal dissipation and low voltage drop",
                    "1-Bin MacAdam SDCM ≤ 3 color consistency across production batches",
                    "Multiple waterproof options: IP20 bare, IP54 silicone coating, IP65 nano/tube, IP67/IP68 co-extrusion",
                ]

            products.append({
                "id": prod_slug,
                "family": family,
                "familySlug": family_slug,
                "series": series,
                "seriesSlug": series_slug,
                "model": model_name,
                "itemNo": item_no,
                "size": size,
                "view": view,
                "voltage": voltage,
                "wattOptions": watt_options,
                "maxLumen": max_lumen,
                "efficacy": efficacy,
                "ledType": led_type,
                "ledsPerM": leds_per_m,
                "cri": cri,
                "sdcm": "SDCM ≤ 3 (1 Bin)",
                "cctOptions": cct_options,
                "ip": ip_rating,
                "minBendRadius": min_bend_radius,
                "minBendDiameter": min_bend_diameter,
                "cutUnit": cut_unit,
                "maxRun": max_run,
                "warranty": warranty,
                "controls": controls,
                "pitch": pitch,
                "features": features,
                "images": visuals,
                "downloads": {
                    "datasheet": datasheet_url,
                    "ies": ies_list,
                    "ldt": ldt_list,
                    "report": report_list,
                },
            })
            doc.close()

    # Copy the 6 Catalog PDFs and extract catalog-exclusive product series
    cat_dir = os.path.join(SOURCE_ROOT, "目录")
    catalogs_meta = [
        {
            "id": "cat-neon-v2",
            "title": "Silicone LED Neon Flex & Wall Grazer Master Catalogue (V2)",
            "filename": "Catalogue of Silicone Led neon_TYRIA LIGHTING-V2.pdf",
            "pages": 36,
            "category": "LED Neon Flex & Wall Grazer",
            "highlight": "50+ Silicone Profiles, Enterprise Profile, Lab & Certifications",
        },
        {
            "id": "cat-strip-2026",
            "title": "2026 Flexible LED Strip & LED Sheet Master Catalogue",
            "filename": "Catalog of FLEX LED STRIP_TYRIA LIGHTING-2026.pdf",
            "pages": 17,
            "category": "LED Strip & Sheet",
            "highlight": "13 Series: High-Efficiency 160–180lm/W, COB, SMD2010/2216/2835/3528/5050/5630/3014, S-Shape",
        },
        {
            "id": "cat-pixel-neon-v3",
            "title": "DMX512 & SPI Addressable Pixel Silicone Neon Flex Catalogue (Ver. 3.0)",
            "filename": "Ver.3.0-Catalogue of DMX512 SPI Led neon flex_TYRIA LIGHTING.pdf",
            "pages": 27,
            "category": "Pixel Neon Flex",
            "highlight": "UCS512 / WS2818 / UCS2904 Breakpoint Transmission Pixel Neon",
        },
        {
            "id": "cat-cob-plus-v23",
            "title": "COB PLUS Integrated Dot-Free LED Strip Catalogue (Ver. 2.3)",
            "filename": "Catalogue of COB PLUS led strip light_TYRIA LIGHTING-Ver.2.3.pdf",
            "pages": 23,
            "category": "COB PLUS Strip",
            "highlight": "8mm / 10mm / 12mm / 14mm Integrated Extrusion COB PLUS",
        },
        {
            "id": "cat-48v-super-long",
            "title": "48V Super Long Run Constant Current LED Strip Catalogue",
            "filename": "Catalogue of 48V super long led strip_TYRIA LIGHTING.pdf",
            "pages": 15,
            "category": "48V Super Long Strip",
            "highlight": "Single-End Power Feed Runs up to 60 Meters Without Voltage Drop",
        },
        {
            "id": "cat-addressable-strip",
            "title": "DMX512 & SPI Addressable Pixel LED Strip Catalogue",
            "filename": "Catalogue of Addressable led strip light_TYRIA LIGHTING.pdf",
            "pages": 22,
            "category": "Addressable Pixel Strip",
            "highlight": "Dual-Signal Breakpoint-Continuous DMX512 & SPI Digital Strips",
        },
    ]

    for c in catalogs_meta:
        src_c = os.path.join(cat_dir, c["filename"])
        safe_c = f"{c['id']}.pdf"
        dst_c = os.path.join(DOWNLOADS_CATALOGS_DIR, safe_c)
        if os.path.exists(src_c) and not os.path.exists(dst_c):
            shutil.copy2(src_c, dst_c)
        c["url"] = f"/downloads/catalogs/{safe_c}"

    # Add the catalog-exclusive series noted in 说明.txt so every sitemap category has rich, real models
    catalog_exclusive_models = [
        {
            "id": "neon-pixel-1615-tv-dmx512",
            "family": "LED Neon Flex",
            "familySlug": "neon-flex",
            "series": "Pixel Neon (DMX512 / SPI)",
            "seriesSlug": "pixel-neon",
            "model": "1615 TV Pixel DMX512 / SPI",
            "itemNo": "TY-NT1615V24P15-Crgbw-DMX512",
            "size": {"w": 16.0, "h": 15.0},
            "view": "TV",
            "voltage": "DC24V",
            "wattOptions": [12, 15],
            "maxLumen": 480,
            "efficacy": 35,
            "ledType": "SMD5050 + UCS512 / WS2818",
            "ledsPerM": 64,
            "cri": "Ra≥80 (White Ch.)",
            "sdcm": "SDCM ≤ 3 (1 Bin)",
            "cctOptions": ["RGB", "RGBW", "DMX512", "SPI"],
            "ip": "IP67",
            "minBendRadius": 80,
            "minBendDiameter": 160,
            "cutUnit": "125mm (8 Pixels/m)",
            "maxRun": "10m",
            "warranty": "5 Years",
            "controls": ["DMX512", "SPI Pixel", "RGB", "RGBW"],
            "pitch": "16×15mm Top-View addressable pixel silicone neon supporting standard DMX512 (UCS512) and breakpoint-transmission SPI (WS2818/UCS2904).",
            "features": [
                "Dual-signal breakpoint transmission (WS2818) or differential DMX512 (1990) protocol",
                "8 pixels/m (125mm cut) or 10 pixels/m (100mm cut) for architectural media facades",
                "Dow SILASTIC™ ET-7021 optical silicone co-extrusion with IP67 weatherproofing",
                "Full Specification in Ver.3.0 Catalogue of DMX512 SPI LED Neon Flex",
            ],
            "images": products[0]["images"] if products else {},
            "downloads": {"datasheet": "/downloads/catalogs/cat-pixel-neon-v3.pdf", "ies": [], "ldt": [], "report": []},
        },
        {
            "id": "neon-pixel-1220-sv-spi",
            "family": "LED Neon Flex",
            "familySlug": "neon-flex",
            "series": "Pixel Neon (DMX512 / SPI)",
            "seriesSlug": "pixel-neon",
            "model": "1220 SV Pixel DMX512 / SPI",
            "itemNo": "TY-NS1220V24P12-Crgb-WS2818",
            "size": {"w": 12.0, "h": 20.0},
            "view": "SV",
            "voltage": "DC24V",
            "wattOptions": [12, 14],
            "maxLumen": 420,
            "efficacy": 35,
            "ledType": "SMD5050 + WS2818 / UCS2904",
            "ledsPerM": 64,
            "cri": "RGB / RGBW",
            "sdcm": "1 Bin",
            "cctOptions": ["RGB", "RGBW", "SPI", "DMX512"],
            "ip": "IP67",
            "minBendRadius": 60,
            "minBendDiameter": 120,
            "cutUnit": "125mm (8 Pixels/m)",
            "maxRun": "10m",
            "warranty": "5 Years",
            "controls": ["SPI Pixel", "DMX512", "RGB", "RGBW"],
            "pitch": "12×20mm Side-View pixel neon for horizontal contours, media signage, and dynamic architectural outlines.",
            "features": [
                "Horizontal bending (Min. diameter 120mm) ideal for 3D signage and curved facades",
                "Available in UCS2904 RGBW (14.5W/m) and WS2818 RGB breakpoint-continuous versions",
                "Dow SILASTIC™ ET-7021 silicone housing with anti-UV and salt-spray durability",
            ],
            "images": products[0]["images"] if products else {},
            "downloads": {"datasheet": "/downloads/catalogs/cat-pixel-neon-v3.pdf", "ies": [], "ldt": [], "report": []},
        },
        {
            "id": "neon-pixel-r25-360-spi",
            "family": "LED Neon Flex",
            "familySlug": "neon-flex",
            "series": "Pixel Neon (DMX512 / SPI)",
            "seriesSlug": "pixel-neon",
            "model": "360° R25 Pixel SPI",
            "itemNo": "TY-NR25V24P12-Crgb-WS2811",
            "size": {"w": 25.0, "h": 25.0},
            "view": "360",
            "voltage": "DC24V",
            "wattOptions": [12, 15],
            "maxLumen": 474,
            "efficacy": 38,
            "ledType": "SMD5050 + WS2811",
            "ledsPerM": 60,
            "cri": "RGB / RGBW",
            "sdcm": "1 Bin",
            "cctOptions": ["RGB", "SPI"],
            "ip": "IP65 / IP67",
            "minBendRadius": 100,
            "minBendDiameter": 200,
            "cutUnit": "100mm (10 Pixels/m)",
            "maxRun": "5m / 10m",
            "warranty": "5 Years",
            "controls": ["SPI Pixel", "RGB"],
            "pitch": "Ø25mm 360° omnidirectional pixel neon tube (10 pixels/m, 474 lm/m) for suspended kinetic sculptures and atrium installations.",
            "features": [
                "360-degree shadow-free radial illumination with 10 addressable pixels per meter",
                "Compatible with rigid clear tube suspension, pendant cables, and artistic clips",
                "Dow SILASTIC™ silicone construction rated for commercial and hospitality atriums",
            ],
            "images": products[1]["images"] if len(products) > 1 else {},
            "downloads": {"datasheet": "/downloads/catalogs/cat-pixel-neon-v3.pdf", "ies": [], "ldt": [], "report": []},
        },
        {
            "id": "strip-48v-super-long-60m",
            "family": "LED Strip",
            "familySlug": "led-strip",
            "series": "48V Super Long (Up to 60m)",
            "seriesSlug": "48v-super-long",
            "model": "48V Super Long 2835 (60m Single-Feed)",
            "itemNo": "TY-ST28Q128V48W10P8-CCx",
            "size": {"w": 10.0, "h": 1.8},
            "view": "Strip",
            "voltage": "DC48V",
            "wattOptions": [5, 8, 10, 12],
            "maxLumen": 1450,
            "efficacy": 125,
            "ledType": "SMD2835 + Onboard CC IC",
            "ledsPerM": 128,
            "cri": "Ra≥90",
            "sdcm": "SDCM ≤ 3 (1 Bin)",
            "cctOptions": ["2700K", "3000K", "3500K", "4000K", "6500K"],
            "ip": "IP20 / IP65 / IP67",
            "minBendRadius": 15,
            "minBendDiameter": 30,
            "cutUnit": "62.5mm",
            "maxRun": "60m (Single-End Feed)",
            "warranty": "5 Years",
            "controls": ["Single Color", "PWM Dimming"],
            "pitch": "DC48V constant-current engineered LED strip achieving up to 60 meters from a single power feed with zero tail-end brightness drop.",
            "features": [
                "Up to 60m single-end power supply run — drastically reduces drivers and wiring labor in coves and tunnels",
                "Onboard constant-current topology guarantees identical lumen output from meter 1 to meter 60",
                "LM-80 certified SMD2835 LEDs with Ra≥90 and SDCM ≤ 3",
            ],
            "images": products[5]["images"] if len(products) > 5 else {},
            "downloads": {"datasheet": "/downloads/catalogs/cat-48v-super-long.pdf", "ies": [], "ldt": [], "report": []},
        },
        {
            "id": "strip-addressable-dmx512-ucs512",
            "family": "LED Strip",
            "familySlug": "led-strip",
            "series": "Addressable Pixel Strip",
            "seriesSlug": "addressable-pixel",
            "model": "DMX512 & SPI Breakpoint Pixel Strip",
            "itemNo": "TY-ST50Q60V24W12P14-Crgbw-UCS512",
            "size": {"w": 12.0, "h": 2.0},
            "view": "Strip",
            "voltage": "DC24V / DC12V",
            "wattOptions": [12, 14, 18],
            "maxLumen": 620,
            "efficacy": 42,
            "ledType": "SMD5050 + UCS512 / WS2818",
            "ledsPerM": 60,
            "cri": "Ra≥80 / RGBW",
            "sdcm": "1 Bin",
            "cctOptions": ["RGB", "RGBW", "DMX512", "SPI"],
            "ip": "IP20 / IP65 / IP67",
            "minBendRadius": 15,
            "minBendDiameter": 30,
            "cutUnit": "100mm",
            "maxRun": "5m / 10m",
            "warranty": "3–5 Years",
            "controls": ["DMX512", "SPI Pixel", "RGB", "RGBW"],
            "pitch": "Industrial addressable digital LED strip supporting DMX512 differential bus and dual-data SPI breakpoint transmission.",
            "features": [
                "Single defective pixel never blocks downstream signal transmission",
                "Compatible with UCS512, TM512, WS2811, WS2815, WS2818, and UCS2904 protocols",
                "Ideal for architectural media walls, stage lighting, and hospitality dynamic coves",
            ],
            "images": products[5]["images"] if len(products) > 5 else {},
            "downloads": {"datasheet": "/downloads/catalogs/cat-addressable-strip.pdf", "ies": [], "ldt": [], "report": []},
        },
        {
            "id": "strip-constant-current-2835",
            "family": "LED Strip",
            "familySlug": "led-strip",
            "series": "Constant Current (No Voltage Drop)",
            "seriesSlug": "constant-current",
            "model": "24V Constant Current 20m/30m Strip",
            "itemNo": "TY-ST28Q120V24W10P12-CCx",
            "size": {"w": 10.0, "h": 1.8},
            "view": "Strip",
            "voltage": "DC24V",
            "wattOptions": [10, 12, 15],
            "maxLumen": 1680,
            "efficacy": 140,
            "ledType": "SMD2835 CC",
            "ledsPerM": 120,
            "cri": "Ra≥90",
            "sdcm": "SDCM ≤ 3 (1 Bin)",
            "cctOptions": ["2700K", "3000K", "4000K", "6000K"],
            "ip": "IP20 / IP65 / IP67",
            "minBendRadius": 15,
            "minBendDiameter": 30,
            "cutUnit": "50mm",
            "maxRun": "20m / 30m",
            "warranty": "5 Years",
            "controls": ["Single Color", "0-10V / DALI / PWM"],
            "pitch": "24V DC Constant-Current linear strip delivering 20m–30m single-feed runs with uniform end-to-end luminance.",
            "features": [
                "Integrated constant-current regulation eliminates start-to-end voltage drop",
                "130–140 lm/W high efficiency at Ra≥90 with 2oz rolled copper PCB",
            ],
            "images": products[5]["images"] if len(products) > 5 else {},
            "downloads": {"datasheet": "/downloads/catalogs/cat-strip-2026.pdf", "ies": [], "ldt": [], "report": []},
        },
    ]

    products.extend(catalog_exclusive_models)

    # Extract Factory & Certificate real images
    factory_imgs, cert_imgs = extract_factory_and_cert_assets()

    # Save products.json, ies_library.json, catalogs.json, factory_certs.json
    with open(os.path.join(DATA_DIR, "products.json"), "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "ies_library.json"), "w", encoding="utf-8") as f:
        json.dump(all_ies_records, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "catalogs.json"), "w", encoding="utf-8") as f:
        json.dump(catalogs_meta, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "factory_certs.json"), "w", encoding="utf-8") as f:
        json.dump({"factory": factory_imgs, "certificates": cert_imgs}, f, ensure_ascii=False, indent=2)

    print(f"Extraction complete! Total products: {len(products)}, IES sets indexed: {len(all_ies_records)}, Factory photos: {len(factory_imgs)}, Certs: {len(cert_imgs)}")


if __name__ == "__main__":
    main()
