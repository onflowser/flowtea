import TeaProfile from 0xf8d6e0586b0a20c7

pub fun main(acc: Address): TeaProfile.Info {

    let project = getAccount(acc)
        .getCapability<&{TeaProfile.Public}>(TeaProfile.publicPath)
        .borrow()
        ?? panic("Could not borrow a reference to the acct2 receiver")

    return project.getInfo()
}
