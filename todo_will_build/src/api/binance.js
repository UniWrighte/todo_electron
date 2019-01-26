export function ticker(){
    fetch("https://api.binance.com/api/v3/ticker/price",{
        method: 'GET'
    }).then((res)=>res.json())
      .then(r=>r)
      .catch(e=>console.error({e}));
}