pub contract TeaProfile {

    pub let publicPath: PublicPath
    pub let storagePath: StoragePath

    pub event Registration(name: String, address: Address)

    pub struct Info {
        pub var name: String
        pub var description: String

        init(name: String, description: String) {
          self.name = name
          self.description = description
        }
    }

    pub resource interface Public {
        access(account) fun setName(value: String)
        pub fun getInfo(): Info
    }

    pub resource Project: Public {
        access(self) var name: String
        access(self) var address: Address
        access(self) var description: String
        access(self) var imageUrl: String

        init(name: String, description: String, address: Address) {
            self.name = name
            self.address = address
            self.description = description
            self.imageUrl = ""
        }

        pub fun getInfo(): Info {
            return Info(name: self.name, description: self.description)
        }

        access(account) fun setName(value: String) {
            pre {
                value.length <= 64: "Name must be 64 or less characters"
            }
            self.name = value
        }

        access(account) fun setImageUrl(value: String) {
            pre {
                value.length <= 200: "Image url must be 200 or less characters"
            }
            self.imageUrl = value
        }

        access(account) fun setDescription(value: String) {
            pre {
                value.length <= 500: "Description must be 500 or less characters"
            }
            self.description = value
        }
    }

    pub fun createProject(name: String, description: String, address: Address) : @TeaProfile.Project {
    	pre {
    		name.length <= 64: "Name must be 64 or less characters"
    	}
    	emit Registration(name: name, address: address)
    	return <- create TeaProfile.Project(name: name, description: description, address: address)
    }

    init() {
		self.publicPath = /public/teaProfile
		self.storagePath = /storage/teaProfile
	}
}
