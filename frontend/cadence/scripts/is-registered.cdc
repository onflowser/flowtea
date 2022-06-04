import TeaProfile from 0xf8d6e0586b0a20c7

pub fun main(acc: Address): Bool {

    let existing = getAccount(acc)
        .getCapability<&{TeaProfile.Public}>(TeaProfile.publicPath);

    return existing.check()
}
