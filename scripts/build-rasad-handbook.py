import json
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
visual_dir = Path(sys.argv[3]) if len(sys.argv) > 3 else None
visual_pages = [
    ("family-charts.png", "سهم انواع سابقه و پل مالی", "بالا، هر رنگ نوعی از سابقه را نشان می‌دهد. پایین، از وصول شروع کنید و هزینهٔ شخص و فرزندان را کم کنید تا به ستون خالص برسید."),
    ("pension-result.png", "نتیجه برآورد مستمری", "کادر اول حاصل ماهانه را نشان می‌دهد. کادرهای بعدی می‌گویند کدام مزد و چند ماه سابقه در فرمول گذاشته شده است."),
    ("column-guide.png", "راهنمای یک ستون", "علامت سؤال کنار «ریال با نرخ مرجع» را بزنید. مثال عددی را بخوانید و برای ادامه، همان موضوع را در دفترچه باز کنید."),
]
visual_pages = [(name, title, caption) for name, title, caption in visual_pages if visual_dir and (visual_dir / name).is_file()]
index = json.loads(subprocess.check_output([node, str(root / "scripts/rasad-handbook-index.cjs")], encoding="utf-8"))
document = Document()
section = document.sections[0]
section.page_width, section.page_height = Inches(8.5), Inches(11)
section.left_margin = section.right_margin = section.top_margin = section.bottom_margin = Inches(1)


def element(parent, name, attrs=None):
    item = OxmlElement(f"w:{name}")
    for key, value in (attrs or {}).items():
        item.set(qn(f"w:{key}"), str(value))
    parent.append(item)
    return item


def style(name, size, color, before, after, bold=False):
    entry = document.styles[name]
    entry.font.name = "Tahoma"
    entry.font.size = Pt(size)
    entry.font.bold = bold
    entry.font.color.rgb = RGBColor.from_string(color)
    props = entry._element.get_or_add_rPr()
    element(props, "lang", {"val": "fa-IR", "bidi": "fa-IR"})
    element(props, "szCs", {"val": size * 2})
    if bold:
        element(props, "bCs")
    for attr in ("ascii", "hAnsi", "cs", "eastAsia"):
        props.rFonts.set(qn(f"w:{attr}"), "Tahoma")
    config = entry.paragraph_format
    config.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    config.space_before, config.space_after = Pt(before), Pt(after)
    config.line_spacing = 1.25
    config.keep_with_next = name.startswith("Heading")
    element(entry._element.get_or_add_pPr(), "bidi")


style("Normal", 11, "173447", 0, 6)
style("Heading 1", 16, "2E74B5", 18, 10, True)
style("Heading 2", 13, "2E74B5", 14, 7, True)
style("Heading 3", 12, "1F4D78", 10, 5, True)
style("Title", 30, "133A53", 14, 10, True)
style("Subtitle", 12, "126B64", 2, 12, True)
document.core_properties.title = "دفترچه راهنمای رصد | داشبورد ۲"
document.core_properties.author = "Amir"


def paragraph(value, name=None):
    item = document.add_paragraph(value, style=name)
    item.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    return item


def labeled(label, value):
    item = paragraph("")
    first = item.add_run(label + " | ")
    first.bold = True
    element(first._element.get_or_add_rPr(), "bCs")
    item.add_run(value)


def add_bookmark(item, name, number):
    element(item._p, "bookmarkStart", {"id": number, "name": name})
    element(item._p, "bookmarkEnd", {"id": number})


def toc_link(name, title):
    item = paragraph("")
    link = element(item._p, "hyperlink", {"anchor": name})
    run = element(link, "r")
    properties = element(run, "rPr")
    element(properties, "color", {"val": "126B64"})
    element(run, "t").text = title


def heading(text, replace_key, number):
    add_bookmark(paragraph(text, "Heading 1"), replace_key, number)


def report(code, detailed=False):
    book = index["books"][code]
    paragraph(index["titles"][code] + " | " + code, "Heading 2")
    labeled("به چه درد می‌خورد؟", book["سؤال"])
    labeled("عدد چطور ساخته می‌شود؟", book["مسیر داده"])
    labeled("مثال", book["مثال"])
    labeled("از کجا شروع کنم؟", book["کار با صفحه"])
    if detailed:
        for name, description in book.items():
            if name not in {"سؤال", "مسیر داده", "مثال", "کار با صفحه"}:
                paragraph(name, "Heading 3")
                paragraph(description)


footer = section.footer.paragraphs[0]
footer.alignment = WD_ALIGN_PARAGRAPH.RIGHT
element(footer._p.get_or_add_pPr(), "bidi")
footer.add_run("دفترچه راهنمای رصد   |   ")
field = element(footer._p, "fldSimple", {"instr": "PAGE"})
element(element(field, "r"), "t").text = "۱"

paragraph("تکاپوگران سپهر مانا   |   سازمان تأمین اجتماعی", "Subtitle")
paragraph("دفترچه راهنمای رصد", "Title")
paragraph("داشبورد ۲ | راهنمای خواندن گزارش‌ها و دنبال‌کردن مسیر هر عدد", "Subtitle")
paragraph("برای اولین بار که وارد رصد می‌شوید، یا وقتی می‌خواهید به یک سؤال درباره یک عدد جواب بدهید، از همین دفترچه شروع کنید. در سایت نیز از علامت سؤال کنار همان ابزار می‌توانید مستقیم به ادامهٔ راهنما بروید.")
paragraph("فهرست موضوعی", "Heading 1")
chapters = [
    ("start", "شروع کار: ورود، جست‌وجو و دو حالت راهنما"),
    ("family", "پوشش و حساب مالی فرد و خانواده"),
    ("pension", "سناریوی «اگر امروز بازنشسته شوم»"),
    ("fields", "ستون‌های جدید؛ از کلید ردیف تا قیمت مرجع"),
    ("profile", "فهرست گزارش‌های پروفایل بیمه‌ای"),
    ("gov", "فهرست گزارش‌های حکمرانی و پایداری مالی"),
    ("review", "مسیر کنترل عدد و رفع مشکل"),
]
if visual_pages:
    chapters.append(("illustrated", "راهنمای تصویری گزارش‌های جدید"))
for key, title in chapters:
    toc_link(key, title)
paragraph("نسخهٔ نمایشی | داده‌ها ساختگی‌اند. نرخ مرجع در خود گزارش همراه تاریخ نمایش داده می‌شود.")
document.add_page_break()

heading(chapters[0][1], "start", 1)
labeled("۱. وارد شوید", "از صفحهٔ داشبورد ۲ با حساب سایت وارد شوید. برای این گزارش ورود جداگانهٔ Power BI لازم نیست.")
labeled("۲. یک پرونده را باز کنید", "«پروفایل فرد» را بزنید. شناسهٔ DEMO-0001 را جست‌وجو کنید و «انتخاب پرونده» را بزنید. این پرونده ده عضو تبعی ساختگی و سه نوع سابقه دارد. برای یک پروندهٔ دیگر DEMO-0005 را امتحان کنید.")
labeled("۳. حالت راهنما را روشن کنید", "دکمهٔ «نیاز به راهنمایی دارم» در بالای گزارش علامت‌های سؤال را نشان می‌دهد. دیالوگ چهار بخش دارد: معنی، مسیر داده، مثال و شیوه استفاده. دکمهٔ «پنهان‌کردن راهنما» منوها را به حالت خلوت برمی‌گرداند.")
labeled("۴. توضیح تکمیلی را باز کنید", "زیر توضیح «دفترچه راهنمای رصد» را بزنید. مرورگر یک زبانهٔ جدا دقیقاً روی موضوع باز می‌کند. در دفترچه می‌توانید از فهرست گزارش‌ها یا کادر جست‌وجو استفاده کنید.")
labeled("۵. نمودار و ریز را کنار هم ببینید", "پس از دیدن شکل نمودار، جدول پایین آن را بررسی کنید: عنوان ستون ممکن است کوتاه باشد، اما علامت سؤال واحد، منبع و مثال همان ستون را دارد. روی عنوان خود ستون بزنید تا مرتب شود.")
document.add_page_break()

heading(chapters[1][1], "family", 2)
report("P-09", True)
document.add_page_break()

heading(chapters[2][1], "pension", 3)
report("P-10", True)
document.add_page_break()

heading(chapters[3][1], "fields", 4)
for key, (title, definition, source, example) in index["fields"].items():
    paragraph(title, "Heading 3")
    labeled("تعریف", definition)
    labeled("روش", source)
    labeled("مثال", example)
document.add_page_break()

heading(chapters[4][1], "profile", 5)
for code in index["titles"]:
    if code.startswith("P-") and code not in {"P-09", "P-10"}:
        report(code)
document.add_page_break()

heading(chapters[5][1], "gov", 6)
for code in index["titles"]:
    if code.startswith("G-"):
        report(code)
document.add_page_break()

heading(chapters[6][1], "review", 7)
labeled("از رقم تا رکورد", "اول تاریخ، مبلغ و فیلتر را یادداشت کنید. بعد جدول ریز را باز کنید. مرجع ثبت را دنبال کنید؛ در گزارش مالی خانواده، وصول و هزینهٔ شخص و تبعی‌ها کلیدهای متفاوت دارند.")
labeled("اگر همه چیز صفر یا خالی شد", "بازه، شعبه و طرح را بررسی کنید. خط تیره یعنی مقدار قابل محاسبه نیست. اگر برای یکی از پرداخت‌ها نرخ ماه موجود نباشد، کل برآورد معادل طلا پنهان می‌شود ولی مبلغ اسمی پابرجاست.")
labeled("جدا کردن سه عدد", "وصول سازمان، هزینه صندوق و مستمری فرضی سه مفهوم جدا هستند. تراز پرونده سود کل سازمان یا بدهی شخص نیست. طلای معادل یعنی سنجش تغییر قیمت بر اساس طلا، نه سپرده یا دارایی فرد.")
labeled("اگر قیمت مرجع تازه نبود", "تاریخ نرخ را بخوانید. می‌توانید نرخ مرجع را در فرم با واحد ریال برای هر گرم تغییر دهید. مقایسه فقط برای تاریخ و مبنای یکسان معنی دارد.")
labeled("اگر نتیجه مستمری با انتظار فرق داشت", "تعداد ماه‌های دارای مزد را در صفحه P-10 ببینید. اول همان مثال ۱۸۰ میلیون ریال و ۳۰۰ ماه را امتحان کنید. این ابزار آموزشی حداقل حقوق، سقف مزد و شروط بازنشستگی را تعیین نمی‌کند.")
for number, (name, title, caption) in enumerate(visual_pages):
    document.add_page_break()
    if number == 0:
        heading(chapters[-1][1], "illustrated", 8)
    paragraph(title, "Heading 2")
    paragraph(caption)
    document.add_picture(str(visual_dir / name), width=Inches(5.25))
    document.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
document.save(output)
