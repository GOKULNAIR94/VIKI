def voOrder = newView('OrderCO_c');
def orderR = voOrder.createRow()

orderR.setAttribute('Account_Id_c',Account_Id_c);
orderR.setAttribute('Contact_Id_c', Contact_Id_c);
orderR.setAttribute('Opportunity_Id_c', Opportunity_Id_c );
orderR.setAttribute('Partner_Id_c', Partner_Id_c);
orderR.setAttribute('Amount_c', Amount_c );

def childOrderLineItems = QuoteLineItemCollection_c;
if(nvl(childOrderLineItems,null) != null)
{
  childOrderLineItems.reset()
  while (childOrderLineItems.hasNext())	
  {
    def curItem = childOrderLineItems.next();
    def orderLineItemR = orderR.OrderLineItemCollection_c
    def newOrderLineItem = orderLineItemR.createRow()

    newOrderLineItem.setAttribute('Product_Id_c',curItem.InventoryItemId);
    newOrderLineItem.setAttribute('Quantity_c',curItem.Quantity)
    newOrderLineItem.setAttribute('EstimatedPrice_c',curItem.UnitPrice)
    newOrderLineItem.setAttribute('Revenue_c',curItem.RevnAmount)

    orderLineItemR.insertRow(newOrderLineItem)
  }
}
voOrder.insertRow(orderR)

throw new oracle.jbo.ValidationException('Quote has been submitted successfully') 