// Volatile database for dummy admin accounts
var dummyDatabase = {
    accounts: [],
    nextId: 10001,

    // Function to create a new account
    createAccount: function(email, password) {
        var newAccount = {
            id: this.nextId,
            name: '',
            telephoneNo: '',
            address: '',
            capacity: '',
            email: email,
            password: password
        };
        this.accounts.push(newAccount); // Store created accounts
        this.nextId++; // Started at 10001, Next admin account ID is 10002.
    },

    // Function to find an account by email and password
    findAccount: function(email, password) {
        return this.accounts.find(account => account.email === email && account.password === password);
    },

    // Function to update account details
    updateAccountDetails: function(email, name, address, telephone, capacity) {
        var account = this.accounts.find(account => account.email === email);
        if (account) {
            account.name = name;
            account.telephoneNo = telephone;
            account.address = address;
            account.capacity = capacity;
        } else {
            console.error('Account not found.');
        }
    }
};
