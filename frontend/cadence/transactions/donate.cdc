// This transaction is a template for a transaction that
// could be used by anyone to send tokens to another account
// that has been set up to receive tokens.
//
// The withdraw amount and the account from getAccount
// would be the parameters to the transaction

import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79
import TeaDonation from 0xf8d6e0586b0a20c7

transaction(message: String, amount: UFix64, recurring: Bool, to: Address) {

    // The Vault resource that holds the tokens that are being transferred
    // let fromVault: @FungibleToken.Vault
    let fromAddress: Address
    let vaultRef: &FungibleToken.Vault

    prepare(signer: AuthAccount) {

        // Get a reference to the signer's stored vault
        self.vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
           ?? panic("Could not borrow reference to the owner's Vault!")

        self.fromAddress = signer.address
    }

    execute {
        TeaDonation.donate(
            vaultRef: self.vaultRef,
            amount: amount,
            fromAddress: self.fromAddress,
            toAddress: to,
            message: message,
            recurring: recurring
        )
    }
}
