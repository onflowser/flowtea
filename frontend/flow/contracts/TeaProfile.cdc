pub contract TeaProfile {

    pub let publicPath: PublicPath
    pub let storagePath: StoragePath

    pub event Registration(name: String)

    pub resource interface Public {
        access(account) fun setName(value: String)
    }

    pub resource Project: Public {
        access(self) var name: String
        access(self) var description: String
        access(self) var logoUrl: String
        access(self) var createdAt: String

        init(name: String, createdAt: String) {
            self.name = name
            self.description = ""
            self.logoUrl = ""
            self.createdAt = createdAt
        }

        access(account) fun setName(value: String) {
            pre {
                value.length <= 64: "Name must be 64 or less characters"
            }
            self.name = value
        }
    }

    pub fun createProject(name: String, createdAt:String) : @TeaProfile.Project {
    	pre {
    		name.length <= 64: "Name must be 64 or less characters"
    		createdAt.length <= 32: "createdAt must be 32 or less characters"
    	}
    	emit Registration(name: name)
    	return <- create TeaProfile.Project(name: name, createdAt: createdAt)
    }

    init() {
		self.publicPath = /public/teaProfile
		self.storagePath = /storage/teaProfile
	}
}
