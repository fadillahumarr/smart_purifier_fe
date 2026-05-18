"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";

import Button from "../atoms/button";
import InputField from "../molecules/input_field";

import { createPurifier, updatePurifier } from "@/app/lib/api/purifiers";

type PurifierFormData = {
    id: string;
    name: string;
    location: string;
    macAddress: string;
    deviceCode: string;
    mqttTopicBase: string;
    firmwareVersion: string;
};

type AddPurifierFormProps = {
    onClose: () => void;
    onSaved?: () => void;
    initialData?: PurifierFormData | null;
};

type FormErrors = {
    name: string;
    location: string;
    macAddress: string;
    deviceCode: string;
    mqttTopicBase: string;
    firmwareVersion: string;
};

const initialErrors: FormErrors = {
    name: "",
    location: "",
    macAddress: "",
    deviceCode: "",
    mqttTopicBase: "",
    firmwareVersion: "",
};

const AddPurifierForm = ({
    onClose,
    onSaved,
    initialData,
}: AddPurifierFormProps) => {
    const isEdit = Boolean(initialData);

    const [name, setName] = useState(initialData?.name ?? "");
    const [location, setLocation] = useState(
        initialData?.location === "-" ? "" : initialData?.location ?? ""
    );
    const [macAddress, setMacAddress] = useState(
        initialData?.macAddress === "-" ? "" : initialData?.macAddress ?? ""
    );
    const [deviceCode, setDeviceCode] = useState(initialData?.deviceCode ?? "");
    const [mqttTopicBase, setMqttTopicBase] = useState(
        initialData?.mqttTopicBase ?? ""
    );
    const [firmwareVersion, setFirmwareVersion] = useState(
        initialData?.firmwareVersion === "-"
            ? ""
            : initialData?.firmwareVersion ?? ""
    );

    const [errors, setErrors] = useState<FormErrors>(initialErrors);

    const clearError = (field: keyof FormErrors) => {
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validateForm = () => {
        const newErrors = { ...initialErrors };

        if (!name.trim()) newErrors.name = "Purifier name is required";
        if (!location.trim()) newErrors.location = "Location is required";

        if (!macAddress.trim()) {
            newErrors.macAddress = "MAC Address is required";
        } else if (!/^([0-9A-Fa-f]{2}[:-]?){5}[0-9A-Fa-f]{2}$/.test(macAddress)) {
            newErrors.macAddress = "Invalid MAC Address format";
        }

        if (!deviceCode.trim()) newErrors.deviceCode = "Device Code is required";
        if (!mqttTopicBase.trim()) newErrors.mqttTopicBase = "MQTT Topic is required";
        if (!firmwareVersion.trim()) {
            newErrors.firmwareVersion = "Firmware Version is required";
        }

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    };

    const getApiErrorMessage = (err: unknown) => {
        const maybeError = err as {
            response?: {
                data?: {
                    detail?: unknown;
                };
            };
        };

        const detail = maybeError.response?.data?.detail;

        if (typeof detail === "string") return detail;

        return isEdit ? "Failed to update purifier" : "Failed to create purifier";
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const payload = {
                name: name.trim(),
                location: location.trim(),
                mac_address: macAddress.trim(),
                device_code: deviceCode.trim(),
                mqtt_topic_base: mqttTopicBase.trim(),
                firmware_version: firmwareVersion.trim(),
            };

            if (isEdit && initialData) {
                await updatePurifier(initialData.id, payload);
            } else {
                await createPurifier(payload);
            }

            await Swal.fire({
                title: isEdit ? "Updated!" : "Created!",
                text: isEdit
                    ? "Purifier has been updated."
                    : "Purifier has been added.",
                icon: "success",
                timer: 1200,
                showConfirmButton: false,
            });

            onSaved?.();
            onClose();
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: getApiErrorMessage(err),
                icon: "error",
            });
        }
    };

    const handleChange =
        (
            setter: React.Dispatch<React.SetStateAction<string>>,
            field: keyof FormErrors
        ) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setter(e.target.value);
                clearError(field);
            };

    return (
        <>
            <div className="fixed w-full h-full inset-0 z-60 bg-foreground/40 " onClick={onClose} />

            <div className="fixed inset-0 z-70 flex items-center justify-center px-4">
                <div className="max-h-[90vh] w-full max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-card dark:bg-background">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">
                                {isEdit ? "Edit Water Purifier" : "Add Water Purifier"}
                            </h2>
                            <p className="mt-1 text-sm text-muted">
                                {isEdit ? "Update device information" : "Register a new device"}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="cursor-pointer rounded-lg p-2 text-muted hover:bg-tertiary/30"
                            type="button"
                        >
                            <Icon icon="mdi:close" className="text-xl" />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                        noValidate
                    >
                        <InputField
                            id="name"
                            name="name"
                            label="Purifier Name"
                            placeholder="e.g. Smart Purifier 01"
                            value={name}
                            onChange={handleChange(setName, "name")}
                            error={errors.name}
                        />

                        <InputField
                            id="location"
                            name="location"
                            label="Location"
                            placeholder="e.g. Lab UNHAS"
                            value={location}
                            onChange={handleChange(setLocation, "location")}
                            error={errors.location}
                        />

                        <InputField
                            id="macAddress"
                            name="macAddress"
                            label="MAC Address"
                            placeholder="e.g. 00:1A:2B:3C:4D:5E"
                            value={macAddress}
                            onChange={handleChange(setMacAddress, "macAddress")}
                            error={errors.macAddress}
                        />

                        <InputField
                            id="deviceCode"
                            name="deviceCode"
                            label="Device Code"
                            placeholder="e.g. WP-001"
                            value={deviceCode}
                            onChange={handleChange(setDeviceCode, "deviceCode")}
                            error={errors.deviceCode}
                        />

                        <InputField
                            id="mqttTopicBase"
                            name="mqttTopicBase"
                            label="MQTT Topic"
                            placeholder="e.g. swp/WP-001"
                            value={mqttTopicBase}
                            onChange={handleChange(setMqttTopicBase, "mqttTopicBase")}
                            error={errors.mqttTopicBase}
                        />

                        <InputField
                            id="firmwareVersion"
                            name="firmwareVersion"
                            label="Firmware Version"
                            placeholder="e.g. v1.0.0"
                            value={firmwareVersion}
                            onChange={handleChange(setFirmwareVersion, "firmwareVersion")}
                            error={errors.firmwareVersion}
                        />

                        <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>

                            <Button type="submit" variant="secondary">
                                {isEdit ? "Update" : "Save"}
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
};

export default AddPurifierForm;