function Queue() 
{
    var items = [];
    
    this.enqueue = function(param) 
    {
        items.push(param);
    }
    
    this.dequeue = function() 
    {
        return items.shift();
    }
    
    this.getLength = function() 
    {
        return items.length;
    }
    
    this.peek = function() 
    {
        return items[0];
    }
}

var inQueue = new Queue();
var outQueue = new Queue();

var chefA = new Chef("Chef A");
var chefB = new Chef("Chef B");
var chefs = [chefA, chefB];

var n = 3;
var m = 5;

function callTheChefs()
{
    chefA.getOrder();
    chefB.getOrder();
}

function orderAvailable() 
{
    if (inQueue.peek() != undefined)
        return true;
    return false;
}

function deliveryAvailable() 
{
    if (outQueue.peek() != undefined)
        return true;
    return false;
}


function Chef(param) 
{
    this.name = param;
    this.available = true;
    var self = this;
    this.getOrder = function() 
    {
        if (orderAvailable()) 
        {
            if(self.available)
            {
                var order = inQueue.dequeue();
                console.log(self.name+" got an order");
                console.log("Order details: " + order["quantity"] + " pizzas / Customer name: " + order["by"]);
                self.prepareRawMaterials(order);   
            }
        }
        setInterval(self.getOrder, (n + 0.1) * 1000);
    };
    
    this.prepareRawMaterials = function(order) 
    {
            self.available = false;
            var timeReq = order["quantity"] * n * 1000;
            setTimeout(function() {
                console.log(self.name + " prepared raw materials for the order from " + order["by"]);
                self.available = true;
                self.cookPizza(order);
            }, timeReq);
    };
    
    this.cookPizza = function(order) 
    {
        var timeReq = order["quantity"] * m * 1000;
        setTimeout(function() 
        {
            console.log(self.name + " cooked pizzas for the order from " + order["by"]);
            self.deliverPizza(order);
        }, timeReq);
    };
    
    this.deliverPizza = function(order) 
    {
        console.log(self.name + " delivered to the counter guy");
        outQueue.enqueue(order);
    };
}


function CounterGuy() 
{
    this.getOrder = function(_quantity, _by) 
    {
        var order = {
            quantity: _quantity,
            by: _by
        };
        inQueue.enqueue(order);
    };
    
    this.deliverOrder = function() 
    {
        if (deliveryAvailable()) 
        {
            var delivery = outQueue.dequeue();
            console.log("Delivery received by " + delivery["by"]);
        }
        setTimeout(this.deliverOrder, 1000);
    };
}
var counterGuy = new CounterGuy();

function Customer(param) 
{
    this.name = param;
    this.placeOrder = function(_quantity) 
    {
        counterGuy.getOrder(_quantity, this.name);
    };
}

var a = new Customer("A");
var b = new Customer("B");
var c = new Customer("C");
var d = new Customer("D");
a.placeOrder(1);
b.placeOrder(2);
c.placeOrder(3);
d.placeOrder(4);
callTheChefs();