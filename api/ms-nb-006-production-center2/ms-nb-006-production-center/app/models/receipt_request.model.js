module.exports = (sql, Sequelize) => {
    const receiptRequest = sql.define('receipt_requests', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        year: {
            type: Sequelize.INTEGER
        },
        season: {
            type: Sequelize.STRING
        },
        crop_code: {
            type: Sequelize.STRING
        },
        variety_code: {
            type: Sequelize.STRING
        }, 
        variety_line_code: {
            type: Sequelize.STRING
        }, 
        indenter_id: {
            type: Sequelize.INTEGER
        }, 
        // user_id: {
        //     type: Sequelize.INTEGER
        // }, 
        spa_code: {
            type: Sequelize.STRING,
        }, 
        state_code: {
            type: Sequelize.STRING
        },
        payment_request: {
            type: Sequelize.STRING
        },
        invoice_amount: {
            type: Sequelize.STRING
        },
        payment_status: {
            type: Sequelize.STRING
        },
        amount_paid: {
            type: Sequelize.STRING
        },
        payment_method: {
            type: Sequelize.STRING
        }, 
        transaction_number: {
            type: Sequelize.STRING
        }, 
        available_breederseed_as_per_invoice: {
            type: Sequelize.INTEGER
        }
    }, {
        timestamps: false,
        // timezone: '+5:30'
    });
    return receiptRequest;
};