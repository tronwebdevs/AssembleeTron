export const safeFetch = (url, options) => {
    return new Promise((resolve, reject) => fetch(url, options).then(res => {
        let contentType = res.headers.get("content-type");
        if(contentType && contentType.includes("application/json")) {
            return res.json();
        }
        throw new TypeError("Si e' verificato un errore nel contattare il server, riprova piu' tardi.");
    }).then(json => resolve(json)).catch(err => reject(err)));
};
