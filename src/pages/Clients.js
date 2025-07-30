import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import ClientForm from '../components/Forms/ClientForm';
import ConfirmDialog from '../components/UI/ConfirmDialog';

const Clients = () => {
  const { clients, actions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterType, setFilterType] = useState('');

  // Filter and sort clients
  const filteredClients = clients
    .filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.phone.includes(searchTerm);
      const matchesType = !filterType || client.clientType === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = (client) => {
    setClientToDelete(client);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      actions.deleteClient(clientToDelete.id);
      setShowDeleteDialog(false);
      setClientToDelete(null);
    }
  };

  const handleSave = (clientData) => {
    if (editingClient) {
      actions.updateClient({ ...clientData, id: editingClient.id });
    } else {
      actions.addClient(clientData);
    }
    setShowForm(false);
    setEditingClient(null);
  };

  const getClientTypeColor = (type) => {
    return type === 'Professionnel' 
      ? 'bg-primary-100 text-primary-800' 
      : 'bg-success-100 text-success-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des clients</h1>
          <p className="mt-1 text-sm text-gray-600">
            {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Ajouter un client
        </button>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Type filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Tous les types</option>
              <option value="Particulier">Particulier</option>
              <option value="Professionnel">Professionnel</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
              <option value="totalPurchases-desc">Meilleurs clients</option>
              <option value="totalPurchases-asc">Nouveaux clients</option>
              <option value="registrationDate-desc">Plus récent</option>
              <option value="registrationDate-asc">Plus ancien</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white rounded-lg shadow-soft p-6 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getClientTypeColor(client.clientType)}`}>
                    {client.clientType}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(client)}
                  className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(client)}
                  className="p-1 text-gray-400 hover:text-danger-600 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <EnvelopeIcon className="w-4 h-4" />
                <span className="truncate">{client.email}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <PhoneIcon className="w-4 h-4" />
                <span>{client.phone}</span>
              </div>
              
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{client.address}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total achats</p>
                  <p className="font-semibold text-success-600">
                    {client.totalPurchases?.toLocaleString() || 0} F CFA
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Dernier achat</p>
                  <p className="font-medium text-gray-900">
                    {client.lastPurchase 
                      ? new Date(client.lastPurchase).toLocaleDateString('fr-FR')
                      : 'Aucun'
                    }
                  </p>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-gray-500 text-sm">Client depuis</p>
                <p className="font-medium text-gray-900 text-sm">
                  {new Date(client.registrationDate).toLocaleDateString('fr-FR')}
                </p>
              </div>

              {client.notes && (
                <div className="mt-3">
                  <p className="text-gray-500 text-sm">Notes</p>
                  <p className="text-gray-700 text-sm line-clamp-2">{client.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="bg-white rounded-lg shadow-soft p-12 text-center">
          <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterType
              ? 'Aucun client ne correspond à vos critères de recherche.'
              : 'Commencez par ajouter votre premier client.'}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Ajouter un client
          </button>
        </div>
      )}

      {/* Client form modal */}
      {showForm && (
        <ClientForm
          client={editingClient}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingClient(null);
          }}
        />
      )}

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <ConfirmDialog
          title="Supprimer le client"
          message={`Êtes-vous sûr de vouloir supprimer "${clientToDelete?.name}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteDialog(false);
            setClientToDelete(null);
          }}
          type="danger"
        />
      )}
    </div>
  );
};

export default Clients;
