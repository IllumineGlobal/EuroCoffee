# -*- coding: utf-8 -*-

{
    "name": "Asset Manager",
    "summary": "Manages Assets in Odoo",
    "version": "1.0.0",
    "category": 'AssetManager',
    "website": "https://www.minacto.com",
    "description": """Manages Assets of Customers in Odoo""",
    'author': 'Kamalitha Gunasinghe',
    'company': 'Minacto Software Solutions (PVT) Ltd',
    'maintainer': 'Kamalitha Gunasinghe',
    'depends':['base', 'project'],
    "data": [
        'security/ir.model.access.csv',
        'views/asset_view.xml',
        'views/project_task_view.xml',
        'views/asset_task_view.xml',
        'views/contracts_view.xml',
        'views/contract_asset_view.xml',
        'views/customer_assets.xml',
        'views/customer_contracts.xml'
    ],
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,
    'application': True,
}
