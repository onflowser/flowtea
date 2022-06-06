import TeaProfile from 0xf8d6e0586b0a20c7

pub fun main(acc: Address): TeaProfile.Info {

    let project = getAccount(acc)
        .getCapability<&{TeaProfile.Public}>(TeaProfile.publicPath)
        .borrow()
        ?? panic("User not registered")

    return project.getInfo()
}
