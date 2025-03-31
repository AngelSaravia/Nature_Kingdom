import React, { useState, useEffect } from "react";
import InputFields from "./inputs.jsx";
import styles from "./forms.module.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const AnimalForm = () => {
    const [formData, setFormData] = useState({
        animal_id: "",
        animal_name: "",
        date_of_birth: "",
        enclosure_id: "",
        species: "",
        animal_type: "",
        health_status: "",
    });

    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [animals, setAnimals] = useState([]);

    // Fetch all animals to populate dropdown
    useEffect(() => {
        fetch("${API_BASE_URL}/get_animals")
            .then(response => response.json())
            .then(data => {
                if (data.success) setAnimals(data.data);
            })
            .catch(error => console.error("Error fetching animals:", error));
    }, []);

    // Handle text input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle dropdown selections
    const handleSelect = (name, value) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handles only numeric input
    const handleNumericInput = (event) => {
        event.target.value = event.target.value.replace(/\D/g, "");
    };

    // Load selected animal details into the form
    const handleAnimalSelect = (animal) => {
        const formattedDate = animal.date_of_birth.split('T')[0];
        setFormData({
            animal_id: animal.animal_id,
            animal_name: animal.animal_name,
            date_of_birth: formattedDate,
            enclosure_id: animal.enclosure_id,
            species: animal.species,
            animal_type: animal.animal_type,
            health_status: animal.health_status,
        });
    };

    // Handle form submission
    const handleSubmit = async (action) => {
        if (action !== "delete" && !formData.animal_name.trim()) {
            setSubmissionStatus("Please fill out all of the required fields.");
            return;
        }
        const requestData = { ...formData };
        if (action === "add") {
            delete requestData.animal_id; // Remove animal_id for add action
        }

        try {
            const response = await fetch("${API_BASE_URL}/animal_form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...requestData, action}),
            });

            const result = await response.json();
            setSubmissionStatus(result.message);

            if (result.success && action !== "delete") {
                setFormData({
                    animal_id: "",
                    animal_name: "",
                    date_of_birth: "",
                    enclosure_id: "",
                    species: "",
                    animal_type: "",
                    health_status: "",
                });
            }

        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmissionStatus("Server error. Please try again.");
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>ANIMAL DATA ENTRY FORM</h2>

            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formRow}>
                    <Dropdown
                        label="Select Animal to Modify/Delete"
                        onSelect={(value) => handleAnimalSelect(JSON.parse(value))}
                        selectedLabel={formData.animal_id ? `${formData.animal_name} (ID: ${formData.animal_id})` : "Select Animal to Modify/Delete"}
                    >
                        {animals.map(animal => (
                            <DropdownItem key={animal.animal_id} value={JSON.stringify(animal)}>
                                {animal.animal_name} (ID: {animal.animal_id})
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>
                <div className={styles.formRow}>
                    <InputFields label="ANIMAL NAME *" name="animal_name" value={formData.animal_name} onChange={handleChange} pattern="[A-Za-z\s\-]+" autoComplete="off"/>
                </div>

                <div className={styles.formRow}>
                    <InputFields label="DATE OF BIRTH *" name="date_of_birth" value={formData.date_of_birth} type="date" onChange={handleChange} autoComplete="bday"/>
                </div>

                <div className={styles.formRow}>
                    <InputFields label="SPECIES *" name="species" value={formData.species} onChange={handleChange} pattern="[A-Za-z\s\-]+" autoComplete="off"/>
                </div>

                <div className={styles.formRow}>
                    <label htmlFor="animal_typeDropdown" className={styles.label}>ANIMAL TYPE (choose one)</label>
                    <Dropdown
                        label={formData.animal_type || "Select animal type *"}
                        onSelect={(value) => handleSelect("animal_type", value)}
                        id="animal_typeDropdown"
                        value={formData.animal_type}
                    >
                        {["Mammal", "Bird", "Reptile", "Amphibian", "Fish", "Invertebrate"].map((option) => (
                            <DropdownItem key={option} value={option}>
                                {option}
                            </DropdownItem>
                        ))}
                    </Dropdown>

                    <label htmlFor="health_statusDropdown" className={styles.label}>HEALTH STATUS (choose one)</label>
                    <Dropdown
                        label={formData.health_status || "Select health status *"}
                        onSelect={(value) => handleSelect("health_status", value)}
                        id="health_statusDropdown"
                        value={formData.health_status}
                    >
                        {["HEALTHY", "NEEDS CARE", "CRITICAL"].map((option) => (
                            <DropdownItem key={option} value={option}>
                                {option}
                            </DropdownItem>
                        ))}
                    </Dropdown>
                </div>

                <div className={styles.formRow}>
                    <InputFields label="ENCLOSURE ID *" name="enclosure_id" type="text" value={formData.enclosure_id} onChange={handleChange} pattern="[0-9]+" onInput={handleNumericInput} autoComplete="off"/>
                </div>
                
                <div className={styles.buttonContainer}>
                    <button type="button" onClick={() => handleSubmit("add")}>ADD</button>
                    <button type="button" onClick={() => handleSubmit("update")}>MODIFY</button>
                    <button type="button" onClick={() => handleSubmit("delete")}>DELETE</button>
                </div>
            </form>
            {submissionStatus && <p className={styles.statusMessage}>{submissionStatus}</p>}
        </div>
    );
};

export default AnimalForm;