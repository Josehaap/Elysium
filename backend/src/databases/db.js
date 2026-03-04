/**
 * *Important - Importaciones para generar pool y la configuración
 */
import mysql2 from 'mysql2'; 
//ConfigDataPool objeto literal de configuración de pool. 
import configDataPool from './database.config';
//-----------------------------

const pool = mysql2.createPool(configDataPool); 