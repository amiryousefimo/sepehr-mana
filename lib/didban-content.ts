import type {Locale} from "@/lib/site";
export async function getDidbanContent(locale:Locale){
  const fallback=locale==="fa"?{
    title:"تحلیل و طراحی",
    summary:"دیدبان؛ فضای همکاری روان‌شناس، روان‌سنج و تحلیل‌گر برای طراحی سنجش آموزشی فناوری کودکان. با حساب شخصی وارد شوید و راهنمای شروع کوتاه را دنبال کنید."
  }:{title:"Analysis & design",summary:"Didban: a guided workspace for psychologists, psychometricians and project analysts reviewing educational technology assessments for children."};
  const origin=process.env.PAYLOAD_PUBLIC_URL?.replace(/\/$/,"");
  if(!origin)return fallback;
  try{
    const projectResponse=await fetch(`${origin}/api/projects?where[key][equals]=${encodeURIComponent(process.env.PAYLOAD_PROJECT_KEY||"tgsepma")}&limit=1`,{next:{revalidate:60}});
    if(!projectResponse.ok)return fallback;
    const project=(await projectResponse.json()).docs?.[0];
    if(!project)return fallback;
    const response=await fetch(`${origin}/api/site-content?where[project][equals]=${encodeURIComponent(project.id)}&where[key][equals]=analysis-and-design&where[locale][equals]=${locale}&draft=false&limit=1`,{next:{revalidate:60}});
    if(!response.ok)return fallback;
    const document=(await response.json()).docs?.[0];
    return {title:typeof document?.title==="string"?document.title:fallback.title,summary:typeof document?.summary==="string"?document.summary:fallback.summary};
  }catch{return fallback;}
}
