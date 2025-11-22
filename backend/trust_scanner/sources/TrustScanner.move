<<<<<<< HEAD
module trust_scanner::TrustScanner {

    use sui::tx_context::TxContext;
    use sui::object::{UID, ID, object};
    use sui::transfer;
    use sui::event;

    /// ----------------------------------------------------------------------------
    /// Scan result stored on-chain
    /// ----------------------------------------------------------------------------
    struct ScanRecord has key, store {
        id: UID,
        package_id: address,
        summary_cid: vector<u8>,
        trust_score: u8,
        attestation_hash: vector<u8>,
        timestamp: u64,
    }

    /// ----------------------------------------------------------------------------
    /// Event for off-chain indexing
    /// ----------------------------------------------------------------------------
    struct ScanStoredEvent has copy, drop {
        record_id: ID,
        package_id: address,
        trust_score: u8,
    }

    /// ----------------------------------------------------------------------------
    /// Entry: store a scan result
    /// ----------------------------------------------------------------------------
    public entry fun store_scan(
        package_id: address,
        summary_cid: vector<u8>,
        trust_score: u8,
        attestation_hash: vector<u8>,
        timestamp: u64,
        ctx: &mut TxContext
    ) {
        let record = ScanRecord {
            id: object::new(ctx),
            package_id,
            summary_cid,
            trust_score,
            attestation_hash,
            timestamp,
        };

        let oid: ID = object::id(&record.id);

        event::emit(ScanStoredEvent {
            record_id: oid,
            package_id,
            trust_score,
        });

        // safer: public_transfer
        transfer::public_transfer(record, ctx.sender());
    }

    /// ----------------------------------------------------------------------------
    /// View: return trust score from stored ScanRecord
    /// ----------------------------------------------------------------------------
    public fun get_score(scan: &ScanRecord): u8 {
        scan.trust_score
    }
=======
module 0x6a80ea2d131e6b6b5809173cad349bd2a9fc6496d31459be76cece265122e5b5::TrustScanner {

    /// Structure to store scan results for a contract
    struct ScanResult has key {
        contract_address: address,
        trust_score: u8, // Placeholder; backend can populate this
    }

    /// Entry function: store scan result for a contract
    public entry fun store_scan_result(user: &signer, contract: address, score: u8) {
        let result = ScanResult { contract_address: contract, trust_score: score };
        move_to(user, result);
    }

    /// Read the scan result for a contract
    public fun get_scan_score(account: address): u8 acquires ScanResult {
        let result_ref = borrow_global<ScanResult>(account);
        result_ref.trust_score
    }

>>>>>>> 85ffe0da6c7618068a6517ca4fb223425ada78ee
}
