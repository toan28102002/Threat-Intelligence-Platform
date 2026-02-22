const db = require('../db/db'); // Adjust the relative path if needed


    const query = `UPDATE tva_mapping SET threat_name = ?, vulnerability_description = ? WHERE asset_id = ?`;

    return new Promise((resolve, reject) => {
        db.run(query, [threatName, description, assetId], function (err) {
            if (err) {
                console.error('Database error:', err.message);
                reject('Database update failed');
            } else {
                console.log('TVA Mapping updated successfully.');
                resolve(`TVA Mapping updated for asset ID ${assetId}`);
            }
        });
    }).finally(() => {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            }
        });
    });
}

module.exports = { updateTVAMapping };

