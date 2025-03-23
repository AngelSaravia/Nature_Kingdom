const db_connection = require("../database");

const insertMembershipQuery = `
  INSERT INTO memberships (
    visitor_id,
    max_guests,
    start_date,
    end_date
  ) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR))
`;

const getVisitorIdQuery = `
  SELECT visitor_id FROM visitors WHERE username = ?
`;

const checkExistingMembership = async (username) => {
    console.log('Checking membership for username:', username);
    const query = `
      SELECT m.* 
      FROM memberships m
      JOIN visitors v ON m.visitor_id = v.visitor_id
      WHERE v.username = ? AND m.end_date > NOW()
    `;
  
    try {
      const [membership] = await db_connection.promise().query(query, [username]);
      console.log('Membership check result:', membership);
      return membership.length > 0;
    } catch (error) {
      console.error('Error checking membership status:', error);
      throw error;
    }
  };
  

  
  // Add to processMembershipPurchase function
const processMembershipPurchase = async (membershipData) => {
    try {
    // Check for existing active membership
        const hasActiveMembership = await checkExistingMembership(membershipData.username);
            if (hasActiveMembership) {
                return {
                success: false,
                message: 'You already have an active membership'
            };
        }
    // Log received data
    console.log('Received membership purchase data:', {
      username: membershipData.username,
      membershipDetails: membershipData.membershipDetails
    });

    // Log visitor query
    console.log('Querying visitor with username:', membershipData.username);
    const [visitor] = await db_connection.promise().query(getVisitorIdQuery, [membershipData.username]);
    
    if (!visitor.length) {
      console.log('No visitor found for username:', membershipData.username);
      throw new Error('Visitor not found');
    }

    console.log('Found visitor_id:', visitor[0].visitor_id);
    const visitor_id = visitor[0].visitor_id;

    // Set max guests based on membership type (you can adjust these values)
    const maxGuests = 5; // Default value, adjust as needed

    // Log membership insertion attempt
    console.log('Attempting to insert membership...');
    await db_connection.promise().query(insertMembershipQuery, [
      visitor_id,
      maxGuests
    ]);
    
    console.log('Membership inserted successfully');

    return {
      success: true,
      message: 'Membership purchased successfully'
    };
  } catch (error) {
    console.error('Error processing membership purchase:', error);
    throw error;
  }
};

  // Add to your exports
  module.exports = {
    processMembershipPurchase,
    checkExistingMembership
  };