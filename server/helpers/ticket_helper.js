const db_connection = require("../database");

const insertTicketQuery = `
  INSERT INTO tickets (
    visitor_id,
    ticket_type,
    price,
    purchase_date,
    start_date,
    end_date
  ) VALUES (?, ?, ?, NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY))
`;




const getVisitorIdQuery = `
  SELECT visitor_id FROM visitors WHERE username = ?
`;

const processTicketPurchase = async (ticketData) => {
  try {
    // Log received data
    console.log('Received ticket purchase data:', {
      username: ticketData.username,
      tickets: ticketData.tickets,
      prices: ticketData.prices,
      total: ticketData.total
    });

    // Log visitor query
    console.log('Querying visitor with username:', ticketData.username);
    const [visitor] = await db_connection.promise().query(getVisitorIdQuery, [ticketData.username]);
    
    if (!visitor.length) {
      console.log('No visitor found for username:', ticketData.username);
      throw new Error('Visitor not found');
    }

    console.log('Found visitor_id:', visitor[0].visitor_id);
    const visitor_id = visitor[0].visitor_id;
    const purchasePromises = [];

    // Log ticket processing
    console.log('Processing tickets...');
    Object.entries(ticketData.tickets).forEach(([type, quantity]) => {
      if (quantity > 0) {
        console.log(`Creating ${quantity} tickets of type: ${type}`);
        for (let i = 0; i < quantity; i++) {
          const price = ticketData.total / quantity;
          console.log(`Inserting ticket - Type: ${type}, Price: ${price}`);
          purchasePromises.push(
            db_connection.promise().query(insertTicketQuery, [
              visitor_id,
              type,
              price,
            ])
          );
        }
      }
    });

    // Log insertion attempt
    console.log('Attempting to insert all tickets...');
    await Promise.all(purchasePromises);
    console.log('All tickets inserted successfully');

    return {
      success: true,
      message: 'Tickets purchased successfully'
    };
  } catch (error) {
    console.error('Error processing ticket purchase:', error);
    throw error;
  }
};

const getUserActiveTickets = async (username) => {
  const query = `
    SELECT t.* 
    FROM tickets t
    JOIN visitors v ON t.visitor_id = v.visitor_id
    WHERE v.username = ? 
  `;

  try {
    console.log('Fetching tickets for user:', username);
    const [tickets] = await db_connection.promise().query(query, [username]);
    console.log('Found tickets:', tickets);

    return {
      success: true,
      tickets: tickets,
      activeCount: tickets.length
    };
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    throw error;
  }
};

module.exports = {
  processTicketPurchase,
  getUserActiveTickets
};