import FlowTea from 0xFlowTea

pub fun main(address: Address): String? {
    return FlowTea.lookupHandle(address: address)
}
