fetch('/getCartItems')
.then(response => response.json())
.then(items => {
   
    let cart = document.getElementById('cart');


    for (let item of items) {

        let itemContainer = document.createElement('div');
        itemContainer.style.display = 'flex';
        itemContainer.style.justifyContent = 'space-between';
        itemContainer.style.gap = '20px'
        itemContainer.style.padding = '0 50px'
        itemContainer.style.alignItems = 'center';

       
        let div = document.createElement('div');
        div.textContent = `${item.name}: ${item.price}`;
        div.style.fontSize = '15px'

        let img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        img.style.marginTop = '40px'
        img.style.width = '150px'; 
        img.style.height = '150px'; 
        img.style.borderRadius = '25px'

    
        itemContainer.appendChild(div);
        itemContainer.appendChild(img);

        cart.appendChild(itemContainer);
    }
})
.catch(error => console.error('Error:', error));
