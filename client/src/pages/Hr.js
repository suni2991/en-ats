import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {CiRead, CiPen} from 'react-icons/ci'
import {AiOutlineDelete} from 'react-icons/ai'
import Papa from 'papaparse';
import FileSaver from 'file-saver';


function HR() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState('');
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const filteredCandidates = candidates.filter(candidate => candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentCandidates = filteredCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

  
  const downloadCSV = () => {
    let candidatesToDownload = [];
  
    if (searchTerm === '') {
      candidatesToDownload = candidates; // Download all candidates
    } else {
      candidatesToDownload = filteredCandidates; // Download searched candidates
    }
  
    const csv = Papa.unparse(candidatesToDownload);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'candidates.csv');
  };
  

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredCandidates.length / candidatesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = () => {
    navigate('/registration')
  }


  const viewCandidate = (id) => {
    navigate('/hr/view/' + id)
  }

  const editCandidate = (id) => {
    navigate('/hr/edit/' + id)
  }


  const deleteCandidate = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B4D2',
      cancelButtonColor: '#8C8C8C',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5040/candidate/${id}`, {
            method: 'DELETE'
          });

          const data = await response.json();

          if (response.ok) {
            // Update the candidate list in state after successful deletion
            setCandidates(candidates.filter(candidate => candidate._id !== id));
            Swal.fire(
              'Deleted!',
              'Applicant has been deleted.',
              'success'
            )
          } else {
            console.error('Error deleting candidate:', data.message);
            Swal.fire(
              'Error!',
              'Failed to delete the Applicant.',
              'error'
            )
          }
        } catch (error) {
          console.error('Error deleting candidate:', error);
          Swal.fire(
            'Error!',
            'Failed to delete the Applicant.',
            'error'
          )
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Applicant is safe :)',
          'info'
        )
      }
    })
  }

const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
const totalButtons = 10;
const renderPaginationButtons = () => {
 
  const maxButtonsPerPage = Math.min(totalButtons, totalPages);

  const buttons = [];

  if (currentPage <= maxButtonsPerPage - Math.floor(totalButtons / 2)) {
    for (let i = 1; i <= maxButtonsPerPage; i++) {
      buttons.push(
        <button key={i} onClick={() => setCurrentPage(i)} className={currentPage === i ? "current-page" : ""}>
          {i}
        </button>
      );
    }
  } else if (currentPage >= totalPages - Math.floor(totalButtons / 2)) {
    for (let i = totalPages - maxButtonsPerPage + 1; i <= totalPages; i++) {
      buttons.push(
        <button key={i} onClick={() => setCurrentPage(i)} className={currentPage === i ? "current-page" : ""}>
          {i}
        </button>
      );
    }
  } else {
    const start = currentPage - Math.floor(totalButtons / 2);
    const end = currentPage + Math.floor(totalButtons / 2);

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button key={i} onClick={() => setCurrentPage(i)} className={currentPage === i ? "current-page" : ""}>
          {i}
        </button>
      );
    }
  }

  return buttons;
};

  useEffect(() => {

    const getCandidates = async () => {
      try {
        const response = await fetch(`http://localhost:5040/candidatesreport`);
        const data = await response.json();
        if(data && data.length > 0) {
          data.map((item, i) => {
            if(item['psychometric'] === -1) {
              item['psychometric'] = 0;
            } 
            if(item['quantitative'] === -1) {
              item['quantitative'] = 0;
            }
             if(item['vocabulary'] === -1) {
              item['vocabulary'] = 0;
            } 
            if(item['java'] === -1) {
              item['java'] = 0;
            } 
            if(item['accounts'] === -1) {
              item['accounts'] = 0;
            } 
            if(item['excel'] === -1) {
              item['excel'] = 0;
            } 
          })
        }
        // data.sort((a, b) => b.createdAt - a.createdAt);
        // setCandidates(data);
        data.sort((a, b) => a.createdAt - b.createdAt);
        setCandidates(data.reverse());
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    getCandidates();
  }, []);

  return (
    <div className="table-container">
    
      <h1 style={{ color: '#00B4D2' }}> Welcome to HR Dashboard </h1><br />
      <div>
        <div className="search-filter">
            <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{margin: '18px'}} />
          <button className="export-csv" style={{ background:'#00B4D2' }} title='Download All / Selected Records as CSV file' onClick={downloadCSV}>Download to CSV</button>
          <button className='submit-button1' style={{ width: '15%', padding: '2px 2px 2px 2px', marginRight: '60px' }} title='Add new Candidate' onClick={handleClick}>Add New</button>
        </div>
      </div>
      <div className='card-view-scroll'>
      {currentCandidates.map(candidate => (
        <div key={candidate._id} className='card-view-container'>
        <div className="card-view">
          
          <div className='card-info'>
            <h2>Name:{candidate.fullName}</h2>
            <hr/>
            <p><b>Email:</b>{candidate.email}</p>
            <p><b>Position:</b>{candidate.appliedPosition}</p>
            <p><b>Status:</b>{candidate.status}</p>
           
            <div className='btn-hr-container'>
            <button className='button-hr-view' title='View' onClick={() => viewCandidate(candidate._id)}><CiRead color='#0398b2' /></button>
            <button className='button-hr-view' title='Edit' onClick={() => editCandidate(candidate._id)}><CiPen color= '#0398b2' /></button>
            <button className='button-hr-view' title='Delete' onClick={() => deleteCandidate(candidate._id)}><AiOutlineDelete color= '#0398b2' /></button>
            </div>
            </div>
            
        </div>
        
        </div>
      ))}
      <div className="hr-pagination">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => setCurrentPage(number)} className={currentPage === number ? "current-page" : ""}>
            {number}
          </button>
        ))}
        </div>

      </div>
  

        <br/>
        <marquee>
      <p style={{ color: 'red' }}> Please DELETE Unwanted/Rejected Records, If no longer needed</p>
    </marquee>
    </div>
  );
}


export default HR;
