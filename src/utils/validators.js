const strip_html = html => {
   let doc = new DOMParser().parseFromString(html, 'text/html');
   return (doc.body.textContent || "").trim();
}

export const requiredHTML = value => {
    let txt = strip_html(value);
    return (txt + "").length > 0;
}
