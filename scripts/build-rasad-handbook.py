import json
import re
import subprocess
import sys
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

root = Path(__file__).resolve().parents[1]
node, output = sys.argv[1:3]
model = json.loads(subprocess.check_output(
    [node, str(root / "scripts/rasad-handbook-index.cjs")], encoding="utf-8"))
doc = Document()
page = doc.sections[0]
page.page_width, page.page_height = Inches(8.27), Inches(11.7)
page.left_margin = page.right_margin = Inches(.8)
page.top_margin = page.bottom_margin = Inches(.75)
doc.core_properties.title = "دفترچهٔ رصد | سه شیوهٔ خواندن هر گزارش"
doc.core_properties.author = "Amir"


def xml(parent, tag, attributes=None):
    child = OxmlElement(f"w:{tag}")
    for key, value in (attributes or {}).items():
        child.set(qn(f"w:{key}"), str(value))
    parent.append(child)
    return child


def style(name, size, color, before, after, bold=False):
    current = doc.styles[name]
    current.font.name, current.font.size = "Tahoma", Pt(size)
    current.font.color.rgb = RGBColor.from_string(color)
    current.font.bold = bold
    props = current._element.get_or_add_rPr()
    for key in ("ascii", "hAnsi", "cs", "eastAsia"):
        props.rFonts.set(qn(f"w:{key}"), "Tahoma")
    xml(props, "lang", {"val": "fa-IR", "bidi": "fa-IR"})
    xml(props, "szCs", {"val": size * 2})
    if bold:
        xml(props, "bCs")
    config = current.paragraph_format
    config.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    config.space_before, config.space_after = Pt(before), Pt(after)
    config.line_spacing = 1.25
    xml(current._element.get_or_add_pPr(), "bidi", {"val": 1})


style("Normal", 10, "18374A", 0, 7)
style("Title", 30, "142F4C", 16, 10, True)
style("Subtitle", 12, "126659", 5, 14, True)
style("Heading 1", 16, "164872", 12, 7, True)
style("Heading 2", 12, "126659", 7, 5, True)
style("Heading 3", 10, "164872", 5, 3, True)


def paragraph(text="", kind=None, parent=None):
    target = (parent if parent is not None else doc).add_paragraph(text, style=kind)
    target.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    return target


def anchor(target, name, index):
    xml(target._p, "bookmarkStart", {"id": index, "name": name})
    xml(target._p, "bookmarkEnd", {"id": index})


def toc_link(key, title):
    target = paragraph()
    target.paragraph_format.space_after = Pt(4)
    link = xml(target._p, "hyperlink", {"anchor": key})
    run = xml(link, "r")
    xml(xml(run, "rPr"), "color", {"val": "14665D"})
    xml(run, "t").text = title


def named(label, value):
    target = paragraph()
    bold = target.add_run(label + " | ")
    bold.bold = True
    xml(bold._element.get_or_add_rPr(), "bCs")
    target.add_run(value)
    return target


def flow(nodes):
    if not nodes:
        return
    table = doc.add_table(rows=1, cols=len(nodes))
    table.autofit = False
    xml(table._tbl.tblPr, "bidiVisual")
    for number, (cell, node_text) in enumerate(zip(table.rows[0].cells, nodes)):
        xml(cell._tc.get_or_add_tcPr(), "shd", {"fill": "E2F2EF" if number % 2 == 0 else "EFF5FA"})
        label = cell.paragraphs[0]
        xml(label._p.get_or_add_pPr(), "bidi")
        label.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        label.add_run(f"{number + 1}. {node_text}")


def track(data):
    for key, label in (("plain", "۱. توضیح ساده"), ("finance", "۲. برای مدیر مالی"), ("engineering", "۳. برای مهندس نرم‌افزار")):
        paragraph(label, "Heading 2")
        for entry in data[key]:
            named(entry["title"], entry["text"])
        if key == "engineering":
            flow(data["flow"])


footer = page.footer.paragraphs[0]
footer.alignment = WD_ALIGN_PARAGRAPH.RIGHT
xml(footer._p.get_or_add_pPr(), "bidi")
footer.add_run("راهنمای رصد    •    ")
xml(footer._p, "fldSimple", {"instr": "PAGE"})

paragraph("تأمین اجتماعی  |  تکاپوگران سپهر مانا", "Subtitle")
paragraph("دفترچهٔ راهنمای رصد", "Title")
paragraph("از یک مثال ساده تا جدول و فرمول", "Subtitle")
paragraph("اگر می‌خواهید یک عدد را بفهمید، با توضیح ساده شروع کنید. اگر برای تصمیم مالی می‌خوانید، به بخش مدیر مالی بروید. برای بازسازی عدد، بخش مهندس و شکل مرحله‌های داده را ببینید. همهٔ پرونده‌های این نسخه نمونه‌اند.")
paragraph("سه عدد که نباید با هم اشتباه شوند", "Heading 2")
paragraph("مورد انتظار یعنی عددی که با یک مبنا حساب کرده‌ایم. تشخیص‌شده یعنی عددی که پس از بررسی ثبت شده است. پیش‌بینی یعنی برآورد آینده با یک‌سری فرض. وصول یعنی پولی که رسیده است. فصل حق‌بیمه با یک مثال تفاوت را نشان می‌دهد.")
paragraph("در خود داشبورد", "Heading 2")
paragraph("«نیاز به راهنمایی دارم» را بزنید، علامت سؤال کنار ستون را باز کنید و سطح خواندن را انتخاب کنید. برای دنبال کردن یک پرونده، DEMO-0001 را در «پروفایل فرد» پیدا کنید.")
doc.add_page_break()
paragraph("فهرست قابل کلیک", "Heading 1")
toc_link("terms", "سه اصطلاح پرکاربرد: مورد انتظار، تشخیص‌شده و پیش‌بینی")
toc_link("erd", "ERD فیزیکی، کلیدهای خارجی و مسیر دادهٔ سایت")
toc_link("reference", "واژه‌نامهٔ تکمیلی نمودارها، شاخص‌ها و ستون‌ها")
for report, title in model["titles"].items():
    toc_link(report.replace("-", "_"), f"{report}  |  {title}")

doc.add_page_break()
anchor(paragraph("سه اصطلاح پرکاربرد", "Heading 1"), "terms", 1)
gov = model["terms"][0]
for key, title in (("Expected", "مورد انتظار"), ("Assessed", "تشخیص‌شده"), ("G-02:Forecast", "پیش‌بینی")):
    data = gov.get(key) or gov.get(key.split(":")[-1])
    if not data:
        raise ValueError(f"Missing glossary entry: {key}")
    paragraph(title, "Heading 2")
    named("ساده", data["plain"])
    named("مثال", data["example"])
    named("مالی", data["finance"])
    named("فنی", data["engineering"])

for index, (key, title) in enumerate(model["titles"].items(), start=10):
    doc.add_page_break()
    anchor(paragraph(f"{title}  |  {key}", "Heading 1"), key.replace("-", "_"), index)
    track(model["guides"][key])

doc.add_page_break()
anchor(paragraph("ERD و مسیر داده", "Heading 1"), "erd", 2)
paragraph("در شکل، ترتیب از راست به چپ است و شماره‌ها مسیر را مشخص می‌کنند. در پیوندهای فیزیکی ۱ به چند، طرف فرزند می‌تواند صفر یا چند ردیف داشته باشد. ۰..۱ در سمت مرجع یعنی کلید خارجی فرزند قابل خالی بودن است. PK کلید اصلی و FK کلید خارجی است.")
paragraph("شکل ۱ | از جغرافیا و پرونده تا رخداد", "Heading 2")
flow(["ref.Province → ref.City → ref.Branch", "dw.Region → dw.Person → dw.Membership", "dw.Premium / dw.Benefit"])
paragraph("شکل ۲ | از SQL تا نمایش در سایت", "Heading 2")
flow(["dw.Ledger / dw.Premium / dw.Benefit", "Viewهای bi و سرویس نمونهٔ محلی", "بسته فشرده → API محافظت‌شده → گزارش"])
paragraph("شکل ۳ | دادهٔ تکمیلی خانواده در سایت", "Heading 2")
flow(["پروندهٔ موجود در بستهٔ پروفایل", "ساخت عضو و ردیف پرداخت از lib/rasad-family.ts", "گزارش P-09؛ این داده در ERD فیزیکی SQL نیست"])
diagram = model["erd"]
paragraph(f"مدل فیزیکی انبار: {len(diagram['tables'])} جدول و {len(diagram['relationships'])} پیوند", "Heading 2")
for title, tables in diagram["groups"]:
    paragraph(title, "Heading 2")
    for name in tables:
        description, columns = diagram["tables"][name]
        paragraph(name, "Heading 3")
        named("هر ردیف چیست؟", description).paragraph_format.keep_with_next = True
        keys = [f"{column} ({role[0]})" for _, column, *role in columns if role]
        links = [f"{field} ← {parent} ({'الزامی' if required else 'اختیاری'})"
                 for parent, child, field, required in diagram["relationships"] if child == name]
        named("ستون کلیدی", "، ".join(keys) if keys else "در قرارداد کلیدی ثبت نشده است.").paragraph_format.keep_with_next = bool(links)
        if links:
            named("مرجع کلیدها", "؛ ".join(links))
paragraph("مشخصات همهٔ ستون‌ها و نوع دادهٔ آنها در بخش بازشوندهٔ ERD دفترچهٔ آنلاین هم در دسترس است.")

for book_number, (group, entries) in enumerate(zip(("حکمرانی و مالی", "پروفایل فرد"), model["reference"])):
    title = paragraph(f"واژه‌نامهٔ تکمیلی | {group}", "Heading 1")
    title.paragraph_format.page_break_before = True
    if book_number == 0:
        anchor(title, "reference", 3)
        paragraph("اگر دنبال نام یک ستون هستید، عنوان فارسی یا نام فنی آن را در Word جست‌وجو کنید. کد کنار برخی از عنوان‌ها یعنی تعریف به همان گزارش اختصاص دارد.")
    for item in entries:
        keys, data = item["keys"], item["data"]
        local_name = next((key for key in keys if re.search(r"[\u0600-\u06ff]", key)), keys[0])
        title = f"{local_name} | {keys[0]}" if keys[0] != local_name else local_name
        paragraph(title, "Heading 3")
        for key, label in (("plain", "ساده"), ("example", "مثال"), ("finance", "مالی"), ("decision", "کاربرد و احتیاط"), ("engineering", "فنی")):
            named(label, data[key]).paragraph_format.keep_with_next = key != "engineering"
doc.save(output)
