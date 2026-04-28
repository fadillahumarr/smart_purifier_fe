"use client";

import { useEffect, useState } from "react";
import AddPurifierForm from "@/app/_components/organisms/add_purifier_form";
import { deletePurifier, getPurifiers } from "@/app/lib/api/purifiers";
import { PurifierResponse } from "@/app/lib/types/purifiers";
import PurifierCard from "../molecules/purifier_card";
import Swal from "sweetalert2";

export type PurifierCardItem = {
    id: string;
    name: string;
    location: string;
    macAddress: string;
    deviceCode: string;
    mqttTopicBase: string;
    firmwareVersion: string;
};

type ListPurifiersProps = {
    isAddOpen: boolean;
    onCloseAdd: () => void;
};

function mapPurifier(item: PurifierResponse): PurifierCardItem {
    return {
        id: item.id,
        name: item.name,
        location: item.location ?? "-",
        macAddress: item.mac_address ?? "-",
        deviceCode: item.device_code,
        mqttTopicBase: item.mqtt_topic_base,
        firmwareVersion: item.firmware_version ?? "-",
    };
}

const ListPurifiers = ({ isAddOpen, onCloseAdd }: ListPurifiersProps) => {
    const [purifiers, setPurifiers] = useState<PurifierCardItem[]>([]);
    const [editingPurifier, setEditingPurifier] =
        useState<PurifierCardItem | null>(null);
    const [loading, setLoading] = useState(true);

    async function loadPurifiers() {
        try {
            const data = await getPurifiers();
            setPurifiers(data.map(mapPurifier));
        } catch (err) {
            console.error("Failed to load purifiers:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPurifiers();
    }, []);

    const handleEdit = (id: string) => {
        const purifier = purifiers.find((p) => p.id === id);
        if (!purifier) return;

        setEditingPurifier(purifier);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Delete?",
            text: "Are you sure you want to delete this purifier?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
        });

        if (!result.isConfirmed) return;

        try {
            Swal.fire({
                title: "Deleting...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => Swal.showLoading(),
            });

            await deletePurifier(id);
            setPurifiers((prev) => prev.filter((item) => item.id !== id));

            await Swal.fire({
                title: "Deleted!",
                text: "Purifier has been removed.",
                icon: "success",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Delete Purifier API failed:", err);

            Swal.fire({
                title: "Error",
                text: "Failed to delete purifier",
                icon: "error",
            });
        }
    };

    const closeForm = () => {
        setEditingPurifier(null);
        onCloseAdd();
    };

    return (
        <>
            <div className="border-t border-border pt-4">
                {loading ? (
                    <p className="text-sm text-muted">Loading purifiers...</p>
                ) : purifiers.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-surface px-6 py-14 text-center dark:bg-background">
                        <h3 className="text-lg font-semibold text-foreground">
                            No purifiers yet
                        </h3>
                        <p className="mt-2 text-sm text-muted">
                            Add your first purifier to start monitoring your water system.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        {purifiers.map((purifier) => (
                            <PurifierCard
                                key={purifier.id}
                                id={purifier.id}
                                name={purifier.name}
                                location={purifier.location}
                                macAddress={purifier.macAddress}
                                deviceCode={purifier.deviceCode}
                                mqttTopicBase={purifier.mqttTopicBase}
                                firmwareVersion={purifier.firmwareVersion}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {(isAddOpen || editingPurifier) && (
                <AddPurifierForm
                    key={editingPurifier?.id ?? "create"}
                    initialData={editingPurifier}
                    onSaved={loadPurifiers}
                    onClose={closeForm}
                />
            )}
        </>
    );
};

export default ListPurifiers;