import React from "react";
import TabPolicie from "./TabPolicie";
import HeaderPolicies from "./HeaderPolicies";
import TabModalEndorsement from "./TabModalEndorsement";
import { useParams } from "react-router-dom";
import { endorsementService } from "../../../../services/endorsement.service";
import { IEndorsement } from "../../../../insuranceModels/Endorsement";

export default function NewEndorsement() {
  const { policyId, endorsementId } = useParams();
  const [valuesData, setValuesData] = React.useState<any>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fechtData();
  }, [loading]);

  const fechtData = async () => {
    
      const restEndorsement = endorsementId
        ? await endorsementService.getEndorsementFolio(endorsementId)
        : undefined;
      setLoading(false);
      if (endorsementId) {
        setValuesData(restEndorsement ? restEndorsement.data : restEndorsement);
      }
  };

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <TabModalEndorsement
          policyId={policyId}
          endorsement={valuesData}
          endorsementId={endorsementId}
        />
      )}
    </>
  );
}
