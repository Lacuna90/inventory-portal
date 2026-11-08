"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";

const categories = [
  "Elektronik",
  "Møbler",
  "Tilbehør",
  "Værktøj",
  "Biler",
  "Kunst",
  "Sport",
  "Andet",
];

const statuses = [
  { value: "hjemme", label: "Hjemme" },
  { value: "udlånt", label: "Udlånt" },
  { value: "reserveret", label: "Reserveret" },
  { value: "til_salg", label: "Til salg" },
  { value: "solgt", label: "Solgt" },
  { value: "defekt", label: "Defekt" },
];

export default function NewItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    navn: "",
    beskrivelse: "",
    kategori: "Elektronik",
    status: "hjemme",
    lokation: "",
    serienummer: "",
    købsdato: "",
    købspris: "",
    salgspris: "",
    kanLånes: false,
    kanUdlejes: false,
    kanSælges: false,
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - uploadedImages.length);
      setUploadedImages((prev) => [
        ...prev,
        ...newImages.map(() => "📷"),
      ]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/inventory");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Opret ny enhed</h1>
          <p className="text-gray-600 mt-1">Tilføj en ny genstand til inventaret</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Grundoplysninger</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Navn *
              </label>
              <input
                type="text"
                name="navn"
                value={formData.navn}
                onChange={handleInputChange}
                required
                placeholder="f.eks. Projektor Sony"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beskrivelse
            </label>
            <textarea
              name="beskrivelse"
              value={formData.beskrivelse}
              onChange={handleInputChange}
              rows={4}
              placeholder="Detaljeret beskrivelse af genstanden..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokation *
              </label>
              <input
                type="text"
                name="lokation"
                value={formData.lokation}
                onChange={handleInputChange}
                required
                placeholder="f.eks. Rum 101, Lager"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serienummer
            </label>
            <input
              type="text"
              name="serienummer"
              value={formData.serienummer}
              onChange={handleInputChange}
              placeholder="f.eks. SN123456789"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Økonomiske oplysninger</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Købsdato
              </label>
              <input
                type="date"
                name="købsdato"
                value={formData.købsdato}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Købspris (DKK)
              </label>
              <input
                type="number"
                name="købspris"
                value={formData.købspris}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salgspris (DKK)
              </label>
              <input
                type="number"
                name="salgspris"
                value={formData.salgspris}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Tilladelser</h2>
          <p className="text-sm text-gray-600">Hvad må genstanden bruges til?</p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="kanLånes"
                name="kanLånes"
                checked={formData.kanLånes}
                onChange={handleInputChange}
                className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="kanLånes" className="text-sm font-medium text-gray-700 cursor-pointer">
                Kan lånes
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="kanUdlejes"
                name="kanUdlejes"
                checked={formData.kanUdlejes}
                onChange={handleInputChange}
                className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="kanUdlejes" className="text-sm font-medium text-gray-700 cursor-pointer">
                Kan udlejes
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="kanSælges"
                name="kanSælges"
                checked={formData.kanSælges}
                onChange={handleInputChange}
                className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="kanSælges" className="text-sm font-medium text-gray-700 cursor-pointer">
                Kan sælges
              </label>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Billeder</h2>
          <p className="text-sm text-gray-600">Upload op til 5 billeder ({uploadedImages.length}/5)</p>

          {/* Upload Area */}
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Klik for at vælge billeder</p>
              <p className="text-xs text-gray-500 mt-1">eller træk og slip billeder her</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadedImages.length >= 5}
              className="hidden"
            />
          </label>

          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group"
                >
                  <span className="text-4xl">{img}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuller
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
          >
            Gem enhed
          </button>
        </div>
      </form>
    </div>
  );
}
