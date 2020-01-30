function replaceFormSubmit(url, form, target, urlRefiner, preFetch) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    if(preFetch) preFetch();
    const newUrl = urlRefiner ? urlRefiner(url) : url;
    fetch(newUrl)
      .then(res => res.json())
      .then(res => (target.innerText = JSON.stringify(res, null, 2)))
      .catch(err => (target.innerText = JSON.stringify(err, null, 2)));
  });
}

const convertForm = document.getElementById("convert-form");
const convertResult = document.getElementById("convert-result");
replaceFormSubmit(
  "/api/convert?input=",
  convertForm,
  convertResult,
  baseUrl => baseUrl + document.getElementById("convert-input").value
);

function stockUrlRefiner(baseUrl) {
  let newUrl = baseUrl + "stock=" + document.getElementById("stock-one").value;
  const secondStock = document.getElementById("stock-two").value;
  const stockLike = document.getElementById("stock-like").value;
  if(secondStock) newUrl += "&stock=" + secondStock;
  if(stockLike) newUrl += "&like=true";
  return newUrl
}

const stockForm = document.getElementById("stock-form");
const stockResult = document.getElementById("stock-result");
replaceFormSubmit(
  "/api/stock-prices?",
  stockForm,
  stockResult,
  stockUrlRefiner,
  () => stockResult.innerText = "Fetching data from an external resource..."
)