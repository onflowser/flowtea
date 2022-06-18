pub contract TeaProfile {

    pub let publicPath: PublicPath
    pub let storagePath: StoragePath
    pub let privatePath: PrivatePath
    access(self) let handleMap: {String: Address};
    access(self) let reverseHandleMap: {Address: String};

    pub event Registration(handle: String, name: String, address: Address)

    pub struct Info {
        pub var name: String
        pub var description: String
        pub var websiteUrl: String

        init(name: String, websiteUrl: String, description: String) {
          self.name = name
          self.websiteUrl = websiteUrl
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
        access(self) var websiteUrl: String
        access(self) var description: String

        init(name: String, websiteUrl: String, description: String, address: Address) {
            self.name = name
            self.address = address
            self.websiteUrl = websiteUrl
            self.description = description
        }

        pub fun getInfo(): Info {
            return Info(name: self.name, websiteUrl: self.websiteUrl, description: self.description)
        }

        pub fun setInfo(info: Info) {
            // TODO: emit event and add indexing to the backend
            pre {
                info.name.length <= 64: "Name must be 64 or less characters"
                info.websiteUrl.length <= 64: "Website URL must be 64 or less characters"
                info.description.length <= 500: "Description must be 500 or less characters"
            }
            self.name = info.name
            self.websiteUrl = info.websiteUrl
            self.description = info.description
        }

    }

    pub fun lookupAddress(handle: String): Address? {
        assert(self.handleMap.containsKey(handle), message: "Handle not found")
        return self.handleMap[handle]
    }

    pub fun lookupHandle(address: Address): String? {
        assert(self.reverseHandleMap.containsKey(address), message: "Address not found")
        return self.reverseHandleMap[address]
    }

    pub fun createProject(handle: String, name: String, websiteUrl: String, description: String, address: Address) : @TeaProfile.Project {
    	pre {
            handle.length <= 32: "Handle must be 32 or less characters"
            websiteUrl.length <= 64: "Website URL must be 64 or less characters"
    		name.length <= 64: "Name must be 64 or less characters"
    	}
        // project names must be unique
        assert(!self.handleMap.containsKey(handle), message: "Handle is already taken")
        self.handleMap.insert(key: handle, address)
        self.reverseHandleMap.insert(key: address, handle)

    	emit Registration(handle: handle, name: name, address: address)
    	return <- create TeaProfile.Project(name: name, websiteUrl: websiteUrl, description: description, address: address)
    }

    init() {
		self.publicPath = /public/teaProfile
		self.storagePath = /storage/teaProfile
		self.privatePath = /private/teaProfile
        self.handleMap = {}
        self.reverseHandleMap = {}
	}
}
