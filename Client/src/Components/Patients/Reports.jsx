import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientAppointments } from '../../Stores/Appointment.slice';
import { selectCurrentUser } from '../../Stores/UserAuthslicer';
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { FileText, ExternalLink } from 'lucide-react';

const Reports = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const { appointments:patientAppointments, loading } = useSelector((state) => state.appointments);
  const [medicalFiles, setMedicalFiles] = useState([]);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchPatientAppointments(currentUser._id));
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (patientAppointments) {
      const files = patientAppointments
        .filter(apt => apt.patientInfoFile)
        .map(apt => ({
          id: apt._id,
          date: apt.date,
          doctor: apt.doctor,
          fileUrl: apt.patientInfoFile,
          department: apt.department
        }));
      setMedicalFiles(files);
    }
  }, [patientAppointments]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medical Reports</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='float-right p-2 m-3'>My Medical Information</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>My Medical Information</DialogTitle>
              <DialogDescription>
                Files uploaded by your doctors.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {loading ? (
                <p>Loading...</p>
              ) : medicalFiles.length > 0 ? (
                <div className="space-y-4">
                  {medicalFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium">{new Date(file.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">Dr. {file.doctor?.fullName || file.doctor?.name || 'Unknown'} - {file.department}</p>
                        </div>
                      </div>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <span className="mr-2">View</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No medical information files found.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Reports