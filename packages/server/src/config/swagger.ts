import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Events API',
      version: '1.0.0',
      description: 'API for event management and user authentication',
    },
    servers: [{url: '/'}],
    components: {
      schemas: {
        Event: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            title: {type: 'string'},
            date: {type: 'string', format: 'date'},
            location: {type: 'string'},
            shortDescription: {type: 'string'},
            description: {type: 'string'},
            isRegistered: {type: 'boolean'},
          },
        },
        EventListItem: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            title: {type: 'string'},
            date: {type: 'string', format: 'date'},
            location: {type: 'string'},
            shortDescription: {type: 'string'},
          },
        },
        EventRegistration: {
          type: 'object',
          required: ['fullName', 'email', 'phone'],
          properties: {
            fullName: {type: 'string'},
            email: {type: 'string', format: 'email'},
            phone: {type: 'string'},
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {$ref: '#/components/schemas/EventListItem'},
            },
            total: {type: 'integer'},
            page: {type: 'integer'},
            limit: {type: 'integer'},
            totalPages: {type: 'integer'},
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            data: {type: 'object'},
            success: {type: 'boolean'},
            message: {type: 'string'},
          },
        },
        AuthRegisterBody: {
          type: 'object',
          required: ['email', 'fullName', 'phone'],
          properties: {
            email: {type: 'string', format: 'email'},
            fullName: {type: 'string'},
            phone: {type: 'string'},
          },
        },
        AuthLoginBody: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {type: 'string', format: 'email'},
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {type: 'boolean'},
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: {type: 'string'},
                    fullName: {type: 'string'},
                    email: {type: 'string'},
                    phone: {type: 'string'},
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../app.ts'),
    path.join(__dirname, '../app.js'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
