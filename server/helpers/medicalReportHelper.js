const db_connection = require("../database");

async function getMedicalRecordsSummary(req, res) {
    const filters = req.query;
    console.log("Filters:", filters);

    try {
        let whereClauses = [];
        let queryParams = [];

        // Filters for the main summary/detailed queries
        if (filters.startDate) {
            whereClauses.push("mr.date >= ?");
            queryParams.push(filters.startDate);
        }
        if (filters.endDate) {
            whereClauses.push("mr.date <= ?");
            queryParams.push(filters.endDate);
        }
        if (filters.employees) {
            const employeeIds = JSON.parse(filters.employees);
            whereClauses.push(`mr.employee_id IN (${employeeIds.map(() => '?').join(', ')})`);
            queryParams.push(...employeeIds);
        }
        if (filters.recordTypes) {
            const recordTypeIds = JSON.parse(filters.recordTypes);
            whereClauses.push(`mr.record_type IN (${recordTypeIds.map(() => '?').join(', ')})`);
            queryParams.push(...recordTypeIds);
        }
        if (filters.enclosures) {
            const enclosureIds = JSON.parse(filters.enclosures);
            whereClauses.push(`mr.enclosure_id IN (${enclosureIds.map(() => '?').join(', ')})`);
            queryParams.push(...enclosureIds);
        }
        if (filters.animalSpecies) {
            const species = JSON.parse(filters.animalSpecies);
            whereClauses.push(`a.species IN (${species.map(() => '?').join(', ')})`);
            queryParams.push(...species);
        }

        const whereClause = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

        // Shared filters for species and enclosures: ONLY date + record type
        let sharedClauses = [];
        let sharedParams = [];

        if (filters.startDate) {
            sharedClauses.push("mr.date >= ?");
            sharedParams.push(filters.startDate);
        }
        if (filters.endDate) {
            sharedClauses.push("mr.date <= ?");
            sharedParams.push(filters.endDate);
        }
        if (filters.recordTypes) {
            const recordTypeIds = JSON.parse(filters.recordTypes);
            sharedClauses.push(`mr.record_type IN (${recordTypeIds.map(() => '?').join(', ')})`);
            sharedParams.push(...recordTypeIds);
        }

        const sharedWhere = sharedClauses.length > 0 ? "WHERE " + sharedClauses.join(" AND ") : "";
        console.log("WHERE Clause:",whereClause," ", queryParams);
        const [
            [totalMedicalRecordsResult],
            [recordsByTypeResult],
            [uniqueAnimalsResult],
            [mostCommonRecordTypeResult],
            [speciesResult],
            [enclosuresResult]
        ] = await Promise.all([
            db_connection.promise().query(`
                SELECT COUNT(*) AS total 
                FROM medical_records mr
                JOIN animals a ON a.animal_id = mr.animal_id
                LEFT JOIN employees e ON e.employee_id = mr.employee_id
                LEFT JOIN enclosures en ON en.enclosure_id = mr.enclosure_id
                ${whereClause}
            `, queryParams),
            db_connection.promise().query(`
                SELECT mr.record_type, COUNT(*) AS count
                FROM medical_records mr
                JOIN animals a ON a.animal_id = mr.animal_id
                LEFT JOIN employees e ON e.employee_id = mr.employee_id
                LEFT JOIN enclosures en ON en.enclosure_id = mr.enclosure_id
                ${whereClause}
                GROUP BY mr.record_type
            `, queryParams),
            db_connection.promise().query(`
                SELECT COUNT(DISTINCT mr.animal_id) AS uniqueAnimals
                FROM medical_records mr
                JOIN animals a ON a.animal_id = mr.animal_id
                LEFT JOIN employees e ON e.employee_id = mr.employee_id
                LEFT JOIN enclosures en ON en.enclosure_id = mr.enclosure_id
                ${whereClause}
            `, queryParams),
            db_connection.promise().query(`
                SELECT mr.record_type 
                FROM medical_records mr
                JOIN animals a ON a.animal_id = mr.animal_id
                LEFT JOIN employees e ON e.employee_id = mr.employee_id
                LEFT JOIN enclosures en ON en.enclosure_id = mr.enclosure_id
                ${whereClause}
                GROUP BY mr.record_type
                ORDER BY COUNT(*) DESC 
                LIMIT 1
            `, queryParams),
            db_connection.promise().query(`
                SELECT DISTINCT a.species 
                FROM animals a
                JOIN medical_records mr ON a.animal_id = mr.animal_id
                ${sharedWhere}
            `, sharedParams),
            db_connection.promise().query(`
                SELECT DISTINCT en.enclosure_id AS id, en.name
                FROM enclosures en
                JOIN medical_records mr ON en.enclosure_id = mr.enclosure_id
                ${sharedWhere}
            `, sharedParams)
        ]);

        const summary = {
            totalMedicalRecords: totalMedicalRecordsResult[0].total,
            recordsByType: recordsByTypeResult.reduce((acc, { record_type, count }) => {
                acc[record_type] = count;
                return acc;
            }, {}),
            uniqueAnimalsWithRecords: uniqueAnimalsResult[0].uniqueAnimals,
            mostCommonRecordType: mostCommonRecordTypeResult[0]?.record_type || "N/A",
        };

        const [detailedRecords] = await db_connection.promise().query(`
            SELECT 
                mr.record_id AS recordId,
                mr.animal_id AS animalId,
                a.animal_name AS animalName,
                mr.record_type AS recordType,
                DATE(mr.date) AS date,
                CONCAT(e.first_name, ' ', e.last_name) AS employee,
                en.name AS enclosure
            FROM medical_records mr
            JOIN animals a ON mr.animal_id = a.animal_id
            LEFT JOIN employees e ON mr.employee_id = e.employee_id
            LEFT JOIN enclosures en ON mr.enclosure_id = en.enclosure_id
            ${whereClause}
        `, queryParams);

        const [employees] = await db_connection.promise().query(`
            SELECT employee_id AS id, CONCAT(first_name, ' ', last_name) AS name
            FROM employees
            WHERE role = 'veterinarian'
            ORDER BY name
        `);

        const recordTypes = [
            'Medication', 'Surgery', 'Disease', 'Vaccination',
            'Injury', 'Checkup', 'Dental', 'Post-Mortem', 'Other'
        ];
        const recordTypesFormatted = recordTypes.map((name, idx) => ({ id: idx, name }));

        sendSuccessResponse(res, {
            summary,
            detailedRecords,
            employees,
            recordTypes: recordTypesFormatted,
            species: speciesResult.map(spec => spec.species),
            enclosures: enclosuresResult.map(enclosure => ({
                id: enclosure.id,
                name: enclosure.name
            }))
        });

    } catch (error) {
        console.error("Error fetching medical records summary:", error);
        sendErrorResponse(res, 500, "Server error");
    }
}

// Helpers
function sendSuccessResponse(res, data = {}) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, ...data }));
}

function sendErrorResponse(res, statusCode = 500, message = "Error occurred") {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message }));
}

module.exports = { getMedicalRecordsSummary };
