function getEnclosuresByUserManagerQuery(userManagerId) {
  return `
    SELECT 
      enclosures.*,
      CONCAT(employees.first_name, ' ', employees.last_name) AS manager_name,
      exhibits.name AS exhibit_name,
      CASE enclosures.temp_control WHEN 1 THEN 'Yes' WHEN 0 THEN 'No' END AS temp_control
    FROM 
      enclosures
    INNER JOIN 
      employees ON enclosures.Manager_id = employees.Employee_id
    INNER JOIN 
      exhibits ON enclosures.exhibit_id = exhibits.exhibit_id
    WHERE 
      employees.Manager_id = ${userManagerId}
  `;
}

module.exports = {
  getEnclosuresByUserManagerQuery,
};
