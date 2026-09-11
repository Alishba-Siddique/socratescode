/** Apply the visitor's explicit choice before paint; otherwise follow the OS. */
export const motionPreferenceScript =
  "(function(){var p='system';try{p=localStorage.getItem('socrates-motion')||p}catch(e){}var q=new URLSearchParams(location.search).get('motion');if(q==='on'||q==='off'||q==='system'){p=q;try{localStorage.setItem('socrates-motion',p)}catch(e){}}if(p!=='on'&&p!=='off')p='system';var r=document.documentElement;r.dataset.motionPreference=p;r.dataset.motion=p==='on'||(p==='system'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)?'on':'off'})();";
