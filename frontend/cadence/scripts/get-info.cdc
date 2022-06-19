import FlowTea from 0xFlowTea

pub fun main(acc: Address): FlowTea.Info {

    let project = getAccount(acc)
        .getCapability<&{FlowTea.Public}>(FlowTea.publicPath)
        .borrow()
        ?? panic("User not registered")

    return project.getInfo()
}
