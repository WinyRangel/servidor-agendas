const Agenda = require ('../models/Agenda');
const Domicilio = require('../models/Domicilio'); 


  const registrarAgenda = async (req, res) => {
    try {
      console.log('Usuario logueado:', req.user); // ✅ DEBUG
      const { domicilio, ...datosAgenda } = req.body;

      let domicilioGuardado = null;

      if (domicilio) {
        // Buscar si ya existe un domicilio con ese nombre
        domicilioGuardado = await Domicilio.findOne({ nombre: domicilio });

        // Si no existe, lo crea
        if (!domicilioGuardado) {
          const nuevoDomicilio = new Domicilio({ nombre: domicilio });
          domicilioGuardado = await nuevoDomicilio.save();
        }
      } else {
        // Si no se envía domicilio, usar "SIN AGENDAR"
        domicilioGuardado = await Domicilio.findOne({ nombre: 'SIN AGENDAR' });
      }

      const nuevaAgenda = new Agenda({
        ...datosAgenda,
        domicilio: domicilioGuardado ? domicilioGuardado._id : undefined
      });

      const agendaGuardada = await nuevaAgenda.save();

      res.status(201).json({
        mensaje: 'Agenda y domicilio registrados correctamente',
        agenda: agendaGuardada,
        domicilio: domicilioGuardado
      });

    } catch (error) {
      console.error('Error al crear agenda y domicilio:', error);
      res.status(500).json({ mensaje: 'Hubo un error al crear la agenda y domicilio' });
    }
  };

  const obtenerDomicilios = async (req, res) => {
  try {
    const domicilios = await Domicilio.find().sort({ nombre: 1 }); // opcional: ordena alfabéticamente
    res.status(200).json(domicilios);
  } catch (error) {
    console.error('Error al obtener domicilios:', error);
    res.status(500).json({ mensaje: 'Hubo un error al obtener los domicilios' });
  }
  };

  const obtenerPorCoordinador = async (req, res) => {
    try {
      // ✅ Extraer coordinadorId del token
      const coordinadorId = req.user.coordinadorId;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10000;
      const skip = (page - 1) * limit;

      const filtro = { coordinador: coordinadorId }; // ✅ Este debe coincidir con el campo en tus agendas

      const [agendas, total] = await Promise.all([
        Agenda.find(filtro)
          .populate('domicilio', 'nombre')
          .sort({ fecha: 1, hora: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        Agenda.countDocuments(filtro)
      ]);

      res.status(200).json({
        agendas,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
    } catch (err) {
      console.error('Error al obtener agendas por coordinador:', err);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  };


module.exports = {
    registrarAgenda,
    obtenerDomicilios,
    obtenerPorCoordinador
}
