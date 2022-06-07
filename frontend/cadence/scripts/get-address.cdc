import TeaProfile from 0xTeaProfile

pub fun main(handle: String): Address? {
    return TeaProfile.lookupAddress(handle: handle)
}
