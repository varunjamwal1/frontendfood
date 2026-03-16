const PendingOrdersAlert = ({orders}) => {

const pending = orders.filter(o=>o.status==="pending");

if(!pending.length) return null;

return(

<div className="bg-yellow-500/10 border border-yellow-500 p-4 rounded-xl mb-6">

<h2 className="text-yellow-300 font-bold mb-3">

Pending Orders ({pending.length})

</h2>

{pending.map(order=>(

<div key={order._id}>

Order #{order.orderNumber} - {order.customerName}

</div>

))}

</div>

);

};

export default PendingOrdersAlert;