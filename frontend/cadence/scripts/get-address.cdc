import TeaProfile from 0xTeaProfile

pub fun main(slug: String): Address? {
    return TeaProfile.lookupAddress(slug: slug)
}
