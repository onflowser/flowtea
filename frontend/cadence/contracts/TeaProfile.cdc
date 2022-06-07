pub contract TeaProfile {

    pub let publicPath: PublicPath
    pub let storagePath: StoragePath
    pub let privatePath: PrivatePath
    access(self) let slugMap: {String: Address};
    access(self) let reverseSlugMap: {Address: String};

    pub event Registration(slug: String, name: String, address: Address)

    pub struct Info {
        pub var name: String
        pub var description: String

        init(name: String, description: String) {
          self.name = name
          self.description = description
        }
    }

    pub resource interface Public {
        pub fun getInfo(): Info
    }

    pub resource interface Private {
        pub fun setInfo(info: Info)
    }

    pub resource Project: Public, Private {
        access(self) var name: String
        access(self) var address: Address
        access(self) var description: String

        init(name: String, description: String, address: Address) {
            self.name = name
            self.address = address
            self.description = description
        }

        pub fun getInfo(): Info {
            return Info(name: self.name, description: self.description)
        }

        pub fun setInfo(info: Info) {
            // TODO: emit event and add indexing to the backend
            pre {
                info.name.length <= 64: "Name must be 64 or less characters"
                info.description.length <= 500: "Description must be 500 or less characters"
            }
            self.name = info.name
            self.description = info.description
        }

    }

    pub fun lookupAddress(slug: String): Address? {
        assert(self.slugMap.containsKey(slug), message: "Slug not found")
        return self.slugMap[slug]
    }

    pub fun lookupSlug(address: Address): String? {
        assert(self.reverseSlugMap.containsKey(address), message: "Address not found")
        return self.reverseSlugMap[address]
    }

    pub fun createProject(slug: String, name: String, description: String, address: Address) : @TeaProfile.Project {
    	pre {
    		name.length <= 64: "Name must be 64 or less characters"
    	}
        // project names must be unique
        assert(!self.slugMap.containsKey(slug), message: "Domain name is already taken")
        self.slugMap.insert(key: slug, address)
        self.reverseSlugMap.insert(key: address, slug)

    	emit Registration(slug: slug, name: name, address: address)
    	return <- create TeaProfile.Project(name: name, description: description, address: address)
    }

    init() {
		self.publicPath = /public/teaProfile
		self.storagePath = /storage/teaProfile
		self.privatePath = /private/teaProfile
        self.slugMap = {}
        self.reverseSlugMap = {}
	}
}
