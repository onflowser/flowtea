import TeaProfile from 0xTeaProfile

pub fun main(address: Address): String? {
    return TeaProfile.lookupHandle(address: address)
}
