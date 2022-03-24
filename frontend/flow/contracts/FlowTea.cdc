import FungibleToken from 0xee82856bf20e2aa6

pub contract FlowTea {

    // service fee, default 2%
    access(contract) let fee: UFix64

    // service owner wallet, receives fee payments
    // access(contract) let ownerWallet: Capability<&{FungibleToken.Receiver}>

    pub event Donation(from: Address, to: Address, amount: UFix64, message: String, recurring: Bool)

    pub fun donate(vaultRef: &FungibleToken.Vault, amount: UFix64, fromAddress: Address, toAddress: Address, message: String, recurring: Bool) {
        // calculate fee amount - predefined percentage of the total amount
        let feeAmount = amount / self.fee
        // withdraw tokens to temporary vaults
        let donationVault <- vaultRef.withdraw(amount: amount)
        let feeVault <- vaultRef.withdraw(amount: feeAmount)

        // get a reference to the recipient's Receiver
        let receiverRef =  getAccount(toAddress)
            .getCapability(/public/flowTokenReceiver)
            .borrow<&{FungibleToken.Receiver}>()
               ?? panic("Could not borrow receiver reference to the recipient's Vault")

        // deposit donation in the recipient wallet
        receiverRef.deposit(from: <-donationVault)
        // deposit fee to the service owner wallet
        receiverRef.deposit(from: <-feeVault)

        emit Donation(from: fromAddress, to: toAddress, amount: amount, message: message, recurring: recurring)
    }

    // TODO: add argument fee: UFix64
    // TODO: initialise owner wallet
    init() {
        self.fee = 2.0
    }
}
