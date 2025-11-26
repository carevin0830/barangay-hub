import React from "react";
import barangayLogo from '@/assets/barangay-logo.png';

type Certificate = {
  certificate_no: string;
  certificate_type: string;
  resident_name: string;
  resident_age?: number;
  purpose: string;
  issued_date: string;
  control_number?: string;
  amount_paid?: number;
  business_type?: string;
  verified_by_kagawad1?: string;
  verified_by_kagawad2?: string;
};

interface CertificateTemplatesProps {
  certificate: Certificate;
}

export const CertificateTemplates = React.forwardRef<HTMLDivElement, CertificateTemplatesProps>(
  ({ certificate }, ref) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'long' });
      const year = date.getFullYear();
      return { day, month, year };
    };

    const { day, month, year } = formatDate(certificate.issued_date);

    if (certificate.certificate_type === "Barangay Clearance") {
      return (
        <div ref={ref} className="bg-white text-black p-12 max-w-4xl mx-auto print:p-8 relative font-serif">
          {/* Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <img src={barangayLogo} alt="Watermark" className="w-96 h-96" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logos */}
            <div className="flex justify-between items-start mb-4">
              <img src={barangayLogo} alt="Barangay Logo" className="w-28 h-28" />
              <img src={barangayLogo} alt="Barangay Logo" className="w-28 h-28" />
            </div>

            <div className="text-center mb-6">
              <p className="text-sm">Republic of the Philippine</p>
              <p className="text-sm">Cordillera Administrative Region</p>
              <p className="text-sm">Province of Abra</p>
              <p className="text-sm">Municipality of Lagangilang</p>
              <p className="text-sm font-semibold">Barangay Poblacion</p>
            </div>

            <div className="border-t-2 border-b-2 border-black py-1 mb-8">
              <p className="text-sm text-center font-bold">OFFICE OF THE PUNONG BARANGAY</p>
            </div>

            <h1 className="text-3xl font-bold text-center my-8 tracking-widest">C L E A R A N C E</h1>

            <p className="mb-4 font-semibold">To Whom It May Concern:</p>

            <div className="space-y-4 text-justify leading-relaxed">
              <p>
                This is to certify that <span className="font-bold underline">{certificate.resident_name}</span>, 
                of legal age, a bona fide resident of Barangay Poblacion, Lagangilang, Abra is known to be a person 
                of good moral character and a law-abiding citizen in this barangay.
              </p>

              <p>
                Certifies further that he/she has never been accused or convicted of any crime whatsoever or has 
                violated any barangay ordinance promulgated by competent authority and the Barangay Council.
              </p>

              <p>
                This clearance is being issued upon request of the interested party for all legal intents and{" "}
                <span className="font-bold underline">{certificate.purpose}</span> purpose.
              </p>

              <p className="mt-8">
                Issued this <span className="font-bold underline">{day}</span> day of{" "}
                <span className="font-bold underline">{month}</span> {year} at Barangay Poblacion, Lagangilang, Abra.
              </p>
            </div>

            <div className="mt-16 text-center">
              <p className="font-bold text-lg">ALEJANDRO A. ALFILER</p>
              <p className="text-sm">Punong Barangay</p>
            </div>

            <div className="mt-8 text-sm italic text-gray-600">
              <p>Not valid without seal</p>
              <p>Amount paid: ₱{certificate.amount_paid || 30}.00</p>
            </div>
          </div>
        </div>
      );
    }

    if (certificate.certificate_type === "Certificate of Indigency") {
      return (
        <div ref={ref} className="bg-white text-black p-12 max-w-4xl mx-auto print:p-8 relative font-serif">
          {/* Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <img src={barangayLogo} alt="Watermark" className="w-96 h-96" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logos */}
            <div className="flex justify-between items-start mb-4">
              <img src={barangayLogo} alt="Barangay Logo" className="w-28 h-28" />
              <img src={barangayLogo} alt="Barangay Logo" className="w-28 h-28" />
            </div>

            <div className="text-center mb-6">
              <p className="text-sm">Republic of the Philippine</p>
              <p className="text-sm">Cordillera Administrative Region</p>
              <p className="text-sm">Province of Abra</p>
              <p className="text-sm">Municipality of Lagangilang</p>
              <p className="text-sm font-semibold">Barangay Poblacion</p>
            </div>

            <div className="border-t-2 border-b-2 border-black py-1 mb-8">
              <p className="text-sm text-center font-bold">OFFICE OF THE PUNONG BARANGAY</p>
            </div>

            <h1 className="text-2xl font-bold text-center my-8">CERTIFICATE OF INDIGENCY</h1>

            <p className="mb-4 font-semibold">To Whom It May Concern:</p>

            <div className="space-y-4 text-justify leading-relaxed">
              <p>
                This is to certify that <span className="font-bold underline">{certificate.resident_name}</span>,{" "}
                <span className="font-bold underline">{certificate.resident_age}</span> years of age, is a bonafide 
                resident of Barangay Poblacion, Lagangilang, Abra.
              </p>

              <p>
                This is to further certify that the above-named individual belongs to an indigent family in the barangay.
              </p>

              <p>
                This certification is issued upon the request of the interested party for all legal intents and{" "}
                <span className="font-bold underline">{certificate.purpose}</span> purpose.
              </p>

              <p className="mt-8">
                Given this <span className="font-bold underline">{day}</span> day of{" "}
                <span className="font-bold underline">{month}</span>, {year} at Barangay Poblacion, Lagangilang, Abra.
              </p>
            </div>

            <div className="mt-16 text-center">
              <p className="font-bold text-lg">ALEJANDRO A. ALFILER</p>
              <p className="text-sm">Punong Barangay</p>
            </div>

            <div className="mt-8 text-sm italic text-gray-600">
              <p>Not valid without seal</p>
            </div>
          </div>
        </div>
      );
    }

    if (certificate.certificate_type === "Certificate of Residency") {
      return (
        <div ref={ref} className="bg-white text-black p-12 max-w-4xl mx-auto print:p-8 relative font-serif">
          {/* Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <img src={barangayLogo} alt="Watermark" className="w-96 h-96" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logos */}
            <div className="flex justify-between items-start mb-4">
              <img src={barangayLogo} alt="Barangay Logo" className="w-28 h-28" />
              <img src={barangayLogo} alt="Barangay Logo" className="w-28 h-28" />
            </div>

            <div className="text-center mb-6">
              <p className="text-sm">Republic of the Philippines</p>
              <p className="text-sm">Cordillera Administrative Region</p>
              <p className="text-sm">Province of Abra</p>
              <p className="text-sm">Municipality of Lagangilang</p>
              <p className="text-sm font-semibold">BARANGAY POBLACION</p>
            </div>

            <div className="border-t-2 border-b-2 border-black py-1 mb-8">
              <p className="text-sm text-center font-bold">OFFICE OF THE PUNONG BARANGAY</p>
            </div>

            <h1 className="text-2xl font-bold text-center my-8">CERTIFICATE OF RESIDENCY</h1>

            <p className="mb-4 font-semibold">To Whom It May Concern:</p>

            <div className="space-y-4 text-justify leading-relaxed">
              <p>
                This is to certify that <span className="font-bold underline">{certificate.resident_name}</span>,{" "}
                <span className="font-bold underline">{certificate.resident_age}</span> years of age, is a bonafide 
                resident of Barangay Poblacion, Lagangilang, Abra.
              </p>

              <p>
                This certification is issued upon the request of the interested party for all legal intents and{" "}
                <span className="font-bold underline">{certificate.purpose}</span> purpose/s.
              </p>

              <p className="mt-8">
                Given this <span className="font-bold underline">{day}</span> day of{" "}
                <span className="font-bold underline">{month}</span> {year} at Barangay Poblacion, Lagangilang, Abra.
              </p>
            </div>

            <div className="mt-12">
              <p className="font-semibold mb-4">Verified by:</p>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="border-b border-black pb-1 mb-1">
                    {certificate.verified_by_kagawad1 || "_________________________"}
                  </div>
                  <p className="text-sm">Barangay Kagawad</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-black pb-1 mb-1">
                    {certificate.verified_by_kagawad2 || "_________________________"}
                  </div>
                  <p className="text-sm">Barangay Kagawad</p>
                </div>
              </div>

              <p className="font-semibold mb-2">Approved by:</p>
              <div className="text-center mt-8">
                <p className="font-bold text-lg">ALEJANDRO A. ALFILER</p>
                <p className="text-sm">Punong Barangay</p>
              </div>
            </div>

            <div className="mt-8 text-sm italic text-gray-600">
              <p>Not valid without seal</p>
              <p>Amount paid: ₱{certificate.amount_paid || 30}.00</p>
            </div>
          </div>
        </div>
      );
    }

    if (certificate.certificate_type === "Business Permit") {
      return (
        <div ref={ref} className="bg-white text-black p-12 max-w-4xl mx-auto print:p-8 relative font-serif">
          {/* Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <img src={barangayLogo} alt="Watermark" className="w-96 h-96" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logos */}
            <div className="flex justify-between items-start mb-4">
              <img src={barangayLogo} alt="Barangay Logo" className="w-28 h-28" />
              <img src={barangayLogo} alt="Barangay Logo" className="w-28 h-28" />
            </div>

            <div className="text-center mb-6">
              <p className="text-sm">Republic of the Philippines</p>
              <p className="text-sm">Cordillera Administrative Region</p>
              <p className="text-sm">Province of Abra</p>
              <p className="text-sm">Municipality of Lagangilang</p>
              <p className="text-sm font-semibold">BARANGAY POBLACION</p>
            </div>

            <div className="border-t-2 border-b-2 border-black py-1 mb-8">
              <p className="text-sm text-center font-bold">OFFICE OF THE PUNONG BARANGAY</p>
            </div>

            <h1 className="text-2xl font-bold text-center my-8">C E R T I F I C A T I O N</h1>
            <h2 className="text-xl text-center mb-8">(Business Permit)</h2>

            <p className="text-right text-sm mb-4">Control No. {certificate.control_number || "________"}</p>

            <p className="mb-4 font-semibold">TO WHOM IT MAY CONCERN:</p>

            <div className="space-y-4 text-justify leading-relaxed">
              <p>
                This is to certify that <span className="font-bold underline">{certificate.resident_name}</span>, 
                of legal age, a resident of Barangay Poblacion, Lagangilang, Abra operates a{" "}
                <span className="font-bold underline">{certificate.business_type || "_______________"}</span> in 
                Poblacion, Lagangilang, Abra.
              </p>

              <p>
                This certification is being issued upon the request of the aforementioned for the application of 
                Business Permit from the Local Government Unit of Lagangilang, Abra.
              </p>

              <p className="mt-8">
                Issued this <span className="font-bold underline">{day}</span> day of{" "}
                <span className="font-bold underline">{month}</span> {year} at Barangay Poblacion, Lagangilang, Abra, 
                Philippines.
              </p>
            </div>

            <div className="mt-16 text-center">
              <p className="font-bold text-lg">ALEJANDRO A. ALFILER</p>
              <p className="text-sm">Punong Barangay</p>
            </div>

            <div className="mt-8 text-sm text-gray-600">
              <p>Amount paid: ₱{certificate.amount_paid || "______"}.00</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
);

CertificateTemplates.displayName = "CertificateTemplates";