import { useState } from "react";
import { useEth } from "./contexts/EthContext";
import "./styles.css";

function MainComp() {
  const { state: { contract, accounts } } = useEth();

  const [agentData, setAgentData] = useState({
    name: "",
    age: "",
    designation: "",
    recordHash: "",
  });

  const [accessData, setAccessData] = useState({
    address: "",
  });

  const [listData, setListData] = useState({
    patientList: [],
    doctorList: [],
    accessedList: [],
  });

  const handleAddAgent = async () => {
    const { name, age, designation, recordHash } = agentData;
    try {
      const result = await contract.methods
        .add_agent(name, age, designation, recordHash)
        .send({ from: accounts[0] });
      alert(`${designation === "0" ? "Patient" : "Doctor"} added successfully!`);
    } catch (error) {
      console.error("Error adding agent:", error);
    }
  };

  const fetchPatientList = async () => {
    try {
      const patients = await contract.methods.get_patient_list().call();
      setListData({ ...listData, patientList: patients });
    } catch (error) {
      console.error("Error fetching patient list:", error);
    }
  };

  const fetchDoctorList = async () => {
    try {
      const doctors = await contract.methods.get_doctor_list().call();
      setListData({ ...listData, doctorList: doctors });
    } catch (error) {
      console.error("Error fetching doctor list:", error);
    }
  };

  const handleGrantAccess = async () => {
    try {
      await contract.methods.permit_access(accessData.address).send({
        from: accounts[0],
        value: "2000000000000000000", // 2 ether
      });
      alert("Access granted successfully!");
    } catch (error) {
      console.error("Error granting access:", error);
    }
  };

  return (
    <div id="App">
      <header>
        <h1>🌟MedRec DApp</h1>
        <p>Modern Blockchain-powered Medical Data System</p>
      </header>

      <section className="form-container">
        <div className="card glass">
          <h2>Add Details</h2>
          <input placeholder="Name" onChange={(e) => setAgentData({ ...agentData, name: e.target.value })} />
          <input placeholder="Age" type="number" onChange={(e) => setAgentData({ ...agentData, age: e.target.value })} />
          <select onChange={(e) => setAgentData({ ...agentData, designation: e.target.value })}>
            <option value="">Select Designation</option>
            <option value="0">Patient</option>
            <option value="1">Doctor</option>
          </select>
          <input placeholder="Record Hash" onChange={(e) => setAgentData({ ...agentData, recordHash: e.target.value })} />
          <button onClick={handleAddAgent} className="btn btn-primary">Add Details</button>
        </div>

        <div className="card glass">
          <h2>Grant Access</h2>
          <input placeholder="Doctor's Address" onChange={(e) => setAccessData({ address: e.target.value })} />
          <button onClick={handleGrantAccess} className="btn btn-success">Grant Access</button>
        </div>
      </section>

      <section className="list-container">
        <div className="card glass">
          <h2>Patient List</h2>
          <button onClick={fetchPatientList} className="btn btn-secondary">View Patients</button>
          <ul>
            {listData.patientList.map((address, index) => (
              <li key={index}>Address: {address}</li>
            ))}
          </ul>
        </div>

        <div className="card glass">
          <h2>Doctor List</h2>
          <button onClick={fetchDoctorList} className="btn btn-secondary">View Doctors</button>
          <ul>
            {listData.doctorList.map((address, index) => (
              <li key={index}>Address: {address}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default MainComp;
