import FlowTea from 0xFlowTea

pub fun main(handle: String): Address? {
    return FlowTea.lookupAddress(handle: handle)
}
