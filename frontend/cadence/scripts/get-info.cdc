import TeaProfile from 0xTeaProfile

pub fun main(acc: Address): TeaProfile.Info {

    let project = getAccount(acc)
        .getCapability<&{TeaProfile.Public}>(TeaProfile.publicPath)
        .borrow()
        ?? panic("User not registered")

    return project.getInfo()
}
