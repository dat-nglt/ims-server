--
-- PostgreSQL database dump
--

\restrict LgcMjlNKP15jf6iJXwl8ddrzpUHXSiA30ozcaRlC3gAwBr6Ky8JbGmrvrvlgguC

-- Dumped from database version 14.20 (Ubuntu 14.20-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.20 (Ubuntu 14.20-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_attendance_sessions_status; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_attendance_sessions_status AS ENUM (
    'open',
    'closed'
);


ALTER TYPE public.enum_attendance_sessions_status OWNER TO ims_root;

--
-- Name: enum_attendance_status; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_attendance_status AS ENUM (
    'checked_in',
    'checked_out',
    'on_leave'
);


ALTER TYPE public.enum_attendance_status OWNER TO ims_root;

--
-- Name: enum_customers_customer_status; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_customers_customer_status AS ENUM (
    'normal',
    'prospect',
    'suspended'
);


ALTER TYPE public.enum_customers_customer_status OWNER TO ims_root;

--
-- Name: enum_customers_customer_type; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_customers_customer_type AS ENUM (
    'khách lẻ',
    'doanh nghiệp',
    'đại lý',
    'vip'
);


ALTER TYPE public.enum_customers_customer_type OWNER TO ims_root;

--
-- Name: enum_departments_status; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_departments_status AS ENUM (
    'active',
    'inactive',
    'archived'
);


ALTER TYPE public.enum_departments_status OWNER TO ims_root;

--
-- Name: enum_location_histories_status; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_location_histories_status AS ENUM (
    'working',
    'idle',
    'break',
    'offline'
);


ALTER TYPE public.enum_location_histories_status OWNER TO ims_root;

--
-- Name: enum_material_usages_usage_type; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_material_usages_usage_type AS ENUM (
    'used',
    'damaged',
    'issued',
    'returned'
);


ALTER TYPE public.enum_material_usages_usage_type OWNER TO ims_root;

--
-- Name: enum_materials_status; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_materials_status AS ENUM (
    'active',
    'low_stock',
    'out_of_stock',
    'inactive'
);


ALTER TYPE public.enum_materials_status OWNER TO ims_root;

--
-- Name: enum_office_locations_type; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_office_locations_type AS ENUM (
    'office',
    'warehouse',
    'branch',
    'other'
);


ALTER TYPE public.enum_office_locations_type OWNER TO ims_root;

--
-- Name: enum_positions_status; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_positions_status AS ENUM (
    'active',
    'inactive',
    'archived'
);


ALTER TYPE public.enum_positions_status OWNER TO ims_root;

--
-- Name: enum_project_history_action; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_project_history_action AS ENUM (
    'created',
    'updated',
    'approved',
    'deleted',
    'assigned',
    'accepted',
    'rejected',
    'started',
    'completed',
    'reported',
    'report_updated',
    'report_approved',
    'report_rejected'
);


ALTER TYPE public.enum_project_history_action OWNER TO ims_root;

--
-- Name: enum_projects_priority; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_projects_priority AS ENUM (
    'low',
    'medium',
    'high'
);


ALTER TYPE public.enum_projects_priority OWNER TO ims_root;

--
-- Name: enum_projects_status; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_projects_status AS ENUM (
    'active',
    'in_progress',
    'completed',
    'on_hold',
    'cancelled'
);


ALTER TYPE public.enum_projects_status OWNER TO ims_root;

--
-- Name: enum_users_approved; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_users_approved AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.enum_users_approved OWNER TO ims_root;

--
-- Name: enum_work_assignments_assigned_status; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_work_assignments_assigned_status AS ENUM (
    'pending',
    'accepted',
    'rejected',
    'completed',
    'cancelled'
);


ALTER TYPE public.enum_work_assignments_assigned_status OWNER TO ims_root;

--
-- Name: enum_work_history_action; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_work_history_action AS ENUM (
    'created',
    'updated',
    'approved',
    'deleted',
    'assigned',
    'accepted',
    'rejected',
    'started',
    'completed',
    'reported',
    'report_updated',
    'report_approved',
    'report_rejected',
    'cancelled'
);


ALTER TYPE public.enum_work_history_action OWNER TO ims_root;

--
-- Name: enum_work_materials_status; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_work_materials_status AS ENUM (
    'allocated',
    'in_progress',
    'completed',
    'cancelled'
);


ALTER TYPE public.enum_work_materials_status OWNER TO ims_root;

--
-- Name: enum_works_payment_status; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_works_payment_status AS ENUM (
    'unpaid',
    'paid',
    'partial'
);


ALTER TYPE public.enum_works_payment_status OWNER TO ims_root;

--
-- Name: enum_works_priority; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_works_priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);


ALTER TYPE public.enum_works_priority OWNER TO ims_root;

--
-- Name: enum_works_status; Type: TYPE; Schema: public; Owner: ims_root
--

CREATE TYPE public.enum_works_status AS ENUM (
    'pending',
    'assigned',
    'in_progress',
    'completed',
    'on_hold',
    'cancelled'
);


ALTER TYPE public.enum_works_status OWNER TO ims_root;

--
-- Name: set_check_in_type_default_duration(); Type: FUNCTION; Schema: public; Owner: ims_root
--

CREATE FUNCTION public.set_check_in_type_default_duration() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    DECLARE
      v_minutes integer;
    BEGIN
      IF (NEW.default_duration_minutes IS NULL OR NEW.default_duration_minutes = 0) AND NEW.start_time IS NOT NULL AND NEW.end_time IS NOT NULL THEN
        v_minutes := FLOOR(EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time))/60);
        IF v_minutes < 0 THEN
          v_minutes := v_minutes + 24 * 60;
        END IF;
        NEW.default_duration_minutes := v_minutes;
      END IF;
      RETURN NEW;
    END;
    $$;


ALTER FUNCTION public.set_check_in_type_default_duration() OWNER TO ims_root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO ims_root;

--
-- Name: attachments; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.attachments (
    id integer NOT NULL,
    work_id integer,
    report_id integer,
    file_name character varying(255) NOT NULL,
    file_url text NOT NULL,
    file_type character varying(50),
    file_size integer,
    uploaded_by integer,
    uploaded_at timestamp with time zone
);


ALTER TABLE public.attachments OWNER TO ims_root;

--
-- Name: COLUMN attachments.work_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attachments.work_id IS 'Công việc liên quan';


--
-- Name: COLUMN attachments.report_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attachments.report_id IS 'Báo cáo liên quan';


--
-- Name: COLUMN attachments.file_name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attachments.file_name IS 'Tên tập tin';


--
-- Name: COLUMN attachments.file_url; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attachments.file_url IS 'URL truy cập tập tin';


--
-- Name: COLUMN attachments.file_type; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attachments.file_type IS 'Loại tập tin: image, document, video...';


--
-- Name: COLUMN attachments.file_size; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attachments.file_size IS 'Dung lượng tập tin (bytes)';


--
-- Name: COLUMN attachments.uploaded_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attachments.uploaded_by IS 'Người upload tập tin';


--
-- Name: COLUMN attachments.uploaded_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attachments.uploaded_at IS 'Thời gian upload';


--
-- Name: attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attachments_id_seq OWNER TO ims_root;

--
-- Name: attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.attachments_id_seq OWNED BY public.attachments.id;


--
-- Name: attendance; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    user_id integer NOT NULL,
    work_id integer,
    project_id integer,
    attendance_session_id integer,
    parent_attendance_id integer,
    check_in_time timestamp with time zone NOT NULL,
    check_out_time timestamp with time zone,
    latitude numeric(10,8),
    longitude numeric(11,8),
    location_name character varying(255),
    address text,
    photo_url text,
    status public.enum_attendance_status DEFAULT 'checked_in'::public.enum_attendance_status,
    distance_from_work numeric(10,2),
    is_within_radius boolean,
    duration_minutes integer,
    device_info text,
    ip_address character varying(45),
    notes text,
    check_in_type_id integer,
    violation_distance numeric(10,2),
    technicians jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.attendance OWNER TO ims_root;

--
-- Name: COLUMN attendance.latitude; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance.latitude IS 'Vĩ độ';


--
-- Name: COLUMN attendance.longitude; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance.longitude IS 'Kinh độ';


--
-- Name: COLUMN attendance.distance_from_work; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance.distance_from_work IS 'Khoảng cách từ công việc';


--
-- Name: COLUMN attendance.is_within_radius; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance.is_within_radius IS 'Có trong phạm vi hay không';


--
-- Name: COLUMN attendance.duration_minutes; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance.duration_minutes IS 'Thời gian làm việc';


--
-- Name: COLUMN attendance.device_info; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance.device_info IS 'Thông tin thiết bị';


--
-- Name: COLUMN attendance.check_in_type_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance.check_in_type_id IS 'FK tới loại chấm công';


--
-- Name: COLUMN attendance.violation_distance; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance.violation_distance IS 'Khoảng cách vi phạm vị trí';


--
-- Name: COLUMN attendance.technicians; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance.technicians IS 'Danh sách technicians (denormalized fallback)';


--
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attendance_id_seq OWNER TO ims_root;

--
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- Name: attendance_locations; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.attendance_locations (
    id integer NOT NULL,
    location_code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    address text,
    latitude numeric(10,8) NOT NULL,
    longitude numeric(11,8) NOT NULL,
    radius integer DEFAULT 50,
    icon character varying(100),
    is_active boolean DEFAULT true,
    notes text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.attendance_locations OWNER TO ims_root;

--
-- Name: COLUMN attendance_locations.location_code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_locations.location_code IS 'Mã định danh duy nhất cho địa điểm (vd: warehouse, office-hanoi)';


--
-- Name: COLUMN attendance_locations.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_locations.name IS 'Tên địa điểm (vd: Văn phòng Proshop - Daikin)';


--
-- Name: COLUMN attendance_locations.type; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_locations.type IS 'Loại địa điểm (vd: warehouse, office, site)';


--
-- Name: COLUMN attendance_locations.address; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_locations.address IS 'Địa chỉ chi tiết của địa điểm';


--
-- Name: COLUMN attendance_locations.latitude; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_locations.latitude IS 'Tọa độ vĩ độ';


--
-- Name: COLUMN attendance_locations.longitude; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_locations.longitude IS 'Tọa độ kinh độ';


--
-- Name: COLUMN attendance_locations.radius; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_locations.radius IS 'Bán kính cho phép chấm công (mét)';


--
-- Name: COLUMN attendance_locations.icon; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_locations.icon IS 'Biểu tượng cho địa điểm trên bản đồ';


--
-- Name: COLUMN attendance_locations.is_active; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_locations.is_active IS 'Địa điểm có hoạt động hay không';


--
-- Name: COLUMN attendance_locations.notes; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_locations.notes IS 'Ghi chú thêm về địa điểm';


--
-- Name: attendance_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.attendance_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attendance_locations_id_seq OWNER TO ims_root;

--
-- Name: attendance_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.attendance_locations_id_seq OWNED BY public.attendance_locations.id;


--
-- Name: attendance_session_histories; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.attendance_session_histories (
    id bigint NOT NULL,
    original_id integer NOT NULL,
    user_id integer,
    work_id integer,
    project_id integer,
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    status character varying(20),
    duration_minutes integer,
    check_in_id integer,
    check_out_id integer,
    attendee_user_ids jsonb DEFAULT '[]'::jsonb,
    notes text,
    metadata jsonb DEFAULT '{}'::jsonb,
    archived_at timestamp with time zone NOT NULL,
    archived_by integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.attendance_session_histories OWNER TO ims_root;

--
-- Name: attendance_session_histories_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.attendance_session_histories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attendance_session_histories_id_seq OWNER TO ims_root;

--
-- Name: attendance_session_histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.attendance_session_histories_id_seq OWNED BY public.attendance_session_histories.id;


--
-- Name: attendance_sessions; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.attendance_sessions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    work_id integer,
    project_id integer,
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    status public.enum_attendance_sessions_status DEFAULT 'open'::public.enum_attendance_sessions_status,
    duration_minutes integer,
    check_in_id integer,
    check_out_id integer,
    notes text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.attendance_sessions OWNER TO ims_root;

--
-- Name: attendance_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.attendance_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attendance_sessions_id_seq OWNER TO ims_root;

--
-- Name: attendance_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.attendance_sessions_id_seq OWNED BY public.attendance_sessions.id;


--
-- Name: attendance_technicians; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.attendance_technicians (
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    attendance_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.attendance_technicians OWNER TO ims_root;

--
-- Name: attendance_type; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.attendance_type (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    default_duration_minutes integer,
    start_time time without time zone,
    end_time time without time zone,
    description text,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.attendance_type OWNER TO ims_root;

--
-- Name: COLUMN attendance_type.code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_type.code IS 'Mã loại chấm công';


--
-- Name: COLUMN attendance_type.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_type.name IS 'Tên loại chấm công';


--
-- Name: COLUMN attendance_type.default_duration_minutes; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_type.default_duration_minutes IS 'Thời lượng mặc định (phút)';


--
-- Name: COLUMN attendance_type.start_time; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_type.start_time IS 'Giờ bắt đầu (HH:MM:SS)';


--
-- Name: COLUMN attendance_type.end_time; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_type.end_time IS 'Giờ kết thúc (HH:MM:SS)';


--
-- Name: attendance_type_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.attendance_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attendance_type_id_seq OWNER TO ims_root;

--
-- Name: attendance_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.attendance_type_id_seq OWNED BY public.attendance_type.id;


--
-- Name: attendance_types; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.attendance_types (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    "time" character varying(50) NOT NULL,
    is_active boolean DEFAULT true,
    notes text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.attendance_types OWNER TO ims_root;

--
-- Name: COLUMN attendance_types.code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_types.code IS 'Mã định danh duy nhất cho loại chấm công (vd: REGULAR, NIGHT_SHIFT)';


--
-- Name: COLUMN attendance_types.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_types.name IS 'Tên loại chấm công (vd: Chấm Công Ca Ngày)';


--
-- Name: COLUMN attendance_types."time"; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_types."time" IS 'Khoảng thời gian áp dụng (vd: 08:00 - 17:00)';


--
-- Name: COLUMN attendance_types.is_active; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_types.is_active IS 'Trạng thái hoạt động';


--
-- Name: COLUMN attendance_types.notes; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_types.notes IS 'Ghi chú';


--
-- Name: COLUMN attendance_types.created_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_types.created_at IS 'Ngày tạo';


--
-- Name: COLUMN attendance_types.updated_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.attendance_types.updated_at IS 'Ngày cập nhật';


--
-- Name: attendance_types_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.attendance_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attendance_types_id_seq OWNER TO ims_root;

--
-- Name: attendance_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.attendance_types_id_seq OWNED BY public.attendance_types.id;


--
-- Name: check_in_types; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.check_in_types (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    default_duration_minutes integer,
    start_time time without time zone,
    end_time time without time zone,
    description text,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.check_in_types OWNER TO ims_root;

--
-- Name: COLUMN check_in_types.code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.check_in_types.code IS 'Mã loại chấm công';


--
-- Name: COLUMN check_in_types.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.check_in_types.name IS 'Tên loại chấm công';


--
-- Name: COLUMN check_in_types.default_duration_minutes; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.check_in_types.default_duration_minutes IS 'Thời lượng mặc định (phút)';


--
-- Name: COLUMN check_in_types.start_time; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.check_in_types.start_time IS 'Giờ bắt đầu (HH:MM:SS)';


--
-- Name: COLUMN check_in_types.end_time; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.check_in_types.end_time IS 'Giờ kết thúc (HH:MM:SS)';


--
-- Name: check_in_types_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.check_in_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.check_in_types_id_seq OWNER TO ims_root;

--
-- Name: check_in_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.check_in_types_id_seq OWNED BY public.check_in_types.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    customer_code character varying(50),
    name character varying(255) NOT NULL,
    phone character varying(50),
    email character varying(128),
    address text,
    is_active boolean DEFAULT true,
    customer_status public.enum_customers_customer_status DEFAULT 'normal'::public.enum_customers_customer_status,
    customer_type public.enum_customers_customer_type DEFAULT 'khách lẻ'::public.enum_customers_customer_type,
    total_works integer DEFAULT 0,
    last_work_date timestamp with time zone,
    contact_person character varying(255),
    contact_position character varying(255),
    account_manager_id integer,
    account_manager_name character varying(255),
    industry character varying(128),
    tax_id character varying(64),
    website character varying(255),
    payment_terms character varying(64),
    contract_start timestamp with time zone,
    contract_end timestamp with time zone,
    last_contact_date timestamp with time zone,
    location_lat numeric(10,8),
    location_lng numeric(11,8),
    notes text,
    created_by integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.customers OWNER TO ims_root;

--
-- Name: COLUMN customers.customer_code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.customers.customer_code IS 'Mã khách hàng bên ngoài';


--
-- Name: COLUMN customers.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.customers.name IS 'Tên khách hàng';


--
-- Name: COLUMN customers.phone; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.customers.phone IS 'Số điện thoại';


--
-- Name: COLUMN customers.email; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.customers.email IS 'Email';


--
-- Name: COLUMN customers.address; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.customers.address IS 'Địa chỉ';


--
-- Name: COLUMN customers.is_active; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.customers.is_active IS 'Trạng thái hoạt động (true = hoạt động, false = không hoạt động)';


--
-- Name: COLUMN customers.customer_status; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.customers.customer_status IS 'Phân loại trạng thái khách hàng';


--
-- Name: COLUMN customers.customer_type; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.customers.customer_type IS 'Loại khách hàng (mặc định: khách lẻ)';


--
-- Name: COLUMN customers.last_contact_date; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.customers.last_contact_date IS 'Ngày liên hệ gần nhất';


--
-- Name: COLUMN customers.location_lat; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.customers.location_lat IS 'Vĩ độ GPS địa điểm khách hàng';


--
-- Name: COLUMN customers.location_lng; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.customers.location_lng IS 'Kinh độ GPS địa điểm khách hàng';


--
-- Name: COLUMN customers.notes; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.customers.notes IS 'Ghi chú CRM';


--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_id_seq OWNER TO ims_root;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: dashboard_metrics; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.dashboard_metrics (
    id integer NOT NULL,
    user_id integer,
    metric_date timestamp with time zone,
    metric_type character varying(50),
    metric_value numeric(10,2),
    metric_json jsonb,
    created_at timestamp with time zone
);


ALTER TABLE public.dashboard_metrics OWNER TO ims_root;

--
-- Name: COLUMN dashboard_metrics.metric_type; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.dashboard_metrics.metric_type IS 'completed_works, total_hours, quality_score...';


--
-- Name: COLUMN dashboard_metrics.metric_json; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.dashboard_metrics.metric_json IS 'Dữ liệu chi tiết dạng JSON';


--
-- Name: dashboard_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.dashboard_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dashboard_metrics_id_seq OWNER TO ims_root;

--
-- Name: dashboard_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.dashboard_metrics_id_seq OWNED BY public.dashboard_metrics.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(50),
    description text,
    manager_id integer,
    phone character varying(20),
    email character varying(255),
    location character varying(255),
    parent_department_id integer,
    status public.enum_departments_status DEFAULT 'active'::public.enum_departments_status,
    is_deleted boolean DEFAULT false,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.departments OWNER TO ims_root;

--
-- Name: TABLE departments; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON TABLE public.departments IS 'Bảng phòng ban của công ty';


--
-- Name: COLUMN departments.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.departments.name IS 'Tên phòng ban';


--
-- Name: COLUMN departments.code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.departments.code IS 'Mã phòng ban';


--
-- Name: COLUMN departments.description; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.departments.description IS 'Mô tả phòng ban';


--
-- Name: COLUMN departments.manager_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.departments.manager_id IS 'Trưởng phòng';


--
-- Name: COLUMN departments.phone; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.departments.phone IS 'Số điện thoại phòng ban';


--
-- Name: COLUMN departments.email; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.departments.email IS 'Email phòng ban';


--
-- Name: COLUMN departments.location; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.departments.location IS 'Vị trí phòng ban';


--
-- Name: COLUMN departments.parent_department_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.departments.parent_department_id IS 'Phòng ban cha';


--
-- Name: COLUMN departments.status; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.departments.status IS 'Trạng thái phòng ban';


--
-- Name: COLUMN departments.is_deleted; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.departments.is_deleted IS 'Soft delete flag';


--
-- Name: COLUMN departments.created_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.departments.created_by IS 'Người tạo';


--
-- Name: COLUMN departments.updated_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.departments.updated_by IS 'Người cập nhật';


--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.departments_id_seq OWNER TO ims_root;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: employee_profiles; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.employee_profiles (
    user_id integer NOT NULL,
    specialization jsonb,
    certification jsonb,
    phone_secondary character varying(20),
    address text,
    date_of_birth timestamp with time zone,
    gender character varying(10),
    id_number character varying(50),
    hire_date timestamp with time zone,
    contract_date timestamp with time zone,
    bank_account_number character varying(50),
    bank_name character varying(100) DEFAULT 'ACB'::character varying,
    total_experience_years integer,
    performance_rating numeric(3,2),
    daily_salary numeric(10,2) DEFAULT 500000,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    department_id integer
);


ALTER TABLE public.employee_profiles OWNER TO ims_root;

--
-- Name: COLUMN employee_profiles.user_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.user_id IS 'Người dùng (FK -> users.id); primary key to enforce 1:1';


--
-- Name: COLUMN employee_profiles.specialization; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.specialization IS 'Danh sách chuyên môn (JSON)';


--
-- Name: COLUMN employee_profiles.certification; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.certification IS 'Danh sách chứng chỉ (JSON)';


--
-- Name: COLUMN employee_profiles.phone_secondary; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.phone_secondary IS 'Số điện thoại liên lạc thứ 2';


--
-- Name: COLUMN employee_profiles.address; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.address IS 'Địa chỉ cư trú';


--
-- Name: COLUMN employee_profiles.date_of_birth; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.date_of_birth IS 'Ngày sinh';


--
-- Name: COLUMN employee_profiles.gender; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.gender IS 'Giới tính: M/F';


--
-- Name: COLUMN employee_profiles.id_number; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.id_number IS 'Số chứng minh thư/CCCD';


--
-- Name: COLUMN employee_profiles.hire_date; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.hire_date IS 'Ngày bắt đầu làm việc';


--
-- Name: COLUMN employee_profiles.contract_date; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.contract_date IS 'Ngày ký hợp đồng';


--
-- Name: COLUMN employee_profiles.bank_account_number; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.bank_account_number IS 'Số tài khoản ngân hàng';


--
-- Name: COLUMN employee_profiles.bank_name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.bank_name IS 'Tên ngân hàng';


--
-- Name: COLUMN employee_profiles.total_experience_years; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.total_experience_years IS 'Tổng năm kinh nghiệm';


--
-- Name: COLUMN employee_profiles.performance_rating; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.performance_rating IS 'Đánh giá hiệu suất (1-5)';


--
-- Name: COLUMN employee_profiles.daily_salary; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.daily_salary IS 'Lương theo ngày (VND)';


--
-- Name: COLUMN employee_profiles.is_active; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.is_active IS 'Hồ sơ có hoạt động hay không';


--
-- Name: COLUMN employee_profiles.department_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.employee_profiles.department_id IS 'ID phòng ban';


--
-- Name: location_histories; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.location_histories (
    id integer NOT NULL,
    user_id integer NOT NULL,
    latitude numeric(10,8) NOT NULL,
    longitude numeric(11,8) NOT NULL,
    accuracy numeric(10,2),
    status public.enum_location_histories_status DEFAULT 'idle'::public.enum_location_histories_status,
    "timestamp" timestamp with time zone NOT NULL,
    device_info text,
    created_at timestamp with time zone
);


ALTER TABLE public.location_histories OWNER TO ims_root;

--
-- Name: location_histories_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.location_histories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.location_histories_id_seq OWNER TO ims_root;

--
-- Name: location_histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.location_histories_id_seq OWNED BY public.location_histories.id;


--
-- Name: material_usages; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.material_usages (
    id integer NOT NULL,
    material_id integer NOT NULL,
    work_code character varying(64),
    sub_work_name character varying(255),
    technician_id integer,
    technician_name character varying(255),
    used_quantity numeric(14,2) DEFAULT 0,
    usage_type public.enum_material_usages_usage_type DEFAULT 'used'::public.enum_material_usages_usage_type,
    unit_price numeric(12,2) DEFAULT 0,
    total_value numeric(14,2) DEFAULT 0,
    notes text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.material_usages OWNER TO ims_root;

--
-- Name: COLUMN material_usages.material_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.material_usages.material_id IS 'ID vật tư';


--
-- Name: COLUMN material_usages.work_code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.material_usages.work_code IS 'Mã công việc liên quan (work_code - chuỗi hệ thống)';


--
-- Name: COLUMN material_usages.sub_work_name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.material_usages.sub_work_name IS 'Tên công việc con hoặc hạng mục sử dụng vật tư';


--
-- Name: COLUMN material_usages.technician_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.material_usages.technician_id IS 'ID kỹ thuật viên thực hiện';


--
-- Name: COLUMN material_usages.technician_name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.material_usages.technician_name IS 'Tên kỹ thuật viên (nếu không có user)';


--
-- Name: COLUMN material_usages.used_quantity; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.material_usages.used_quantity IS 'Số lượng đã dùng cho sub-work này';


--
-- Name: COLUMN material_usages.usage_type; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.material_usages.usage_type IS 'Loại ghi nhận';


--
-- Name: COLUMN material_usages.unit_price; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.material_usages.unit_price IS 'Giá 1 đơn vị tại thời điểm ghi nhận';


--
-- Name: COLUMN material_usages.total_value; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.material_usages.total_value IS 'Giá trị cho bản ghi này (used_quantity * unit_price)';


--
-- Name: COLUMN material_usages.notes; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.material_usages.notes IS 'Ghi chú sử dụng';


--
-- Name: material_usages_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.material_usages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.material_usages_id_seq OWNER TO ims_root;

--
-- Name: material_usages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.material_usages_id_seq OWNED BY public.material_usages.id;


--
-- Name: materials; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.materials (
    id integer NOT NULL,
    material_code uuid NOT NULL,
    code character varying(100),
    name character varying(255) NOT NULL,
    description text,
    unit character varying(50),
    quantity numeric(14,2) DEFAULT 0,
    used_quantity numeric(14,2) DEFAULT 0,
    damaged_quantity numeric(14,2) DEFAULT 0,
    unit_price numeric(12,2) DEFAULT 0,
    reorder_level numeric(14,2) DEFAULT 0,
    status public.enum_materials_status DEFAULT 'active'::public.enum_materials_status,
    created_by integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.materials OWNER TO ims_root;

--
-- Name: COLUMN materials.material_code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.material_code IS 'Mã vật tư duy nhất (UUID)';


--
-- Name: COLUMN materials.code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.code IS 'Mã ngắn của vật tư (ví dụ MAT001)';


--
-- Name: COLUMN materials.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.name IS 'Tên vật tư';


--
-- Name: COLUMN materials.description; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.description IS 'Mô tả vật tư';


--
-- Name: COLUMN materials.unit; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.unit IS 'Đơn vị tính';


--
-- Name: COLUMN materials.quantity; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.quantity IS 'Tổng số lượng vật tư';


--
-- Name: COLUMN materials.used_quantity; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.used_quantity IS 'Số lượng đã dùng';


--
-- Name: COLUMN materials.damaged_quantity; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.damaged_quantity IS 'Số lượng bị hỏng';


--
-- Name: COLUMN materials.unit_price; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.unit_price IS 'Giá trên một đơn vị vật tư (dùng để tính giá trị xuất kho)';


--
-- Name: COLUMN materials.reorder_level; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.reorder_level IS 'Ngưỡng cảnh báo tồn kho (số lượng)';


--
-- Name: COLUMN materials.status; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.status IS 'Trạng thái vật tư';


--
-- Name: COLUMN materials.created_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.created_by IS 'ID người tạo';


--
-- Name: COLUMN materials.created_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.created_at IS 'Thời gian tạo bản ghi';


--
-- Name: COLUMN materials.updated_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.materials.updated_at IS 'Thời gian cập nhật bản ghi cuối cùng';


--
-- Name: materials_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.materials_id_seq OWNER TO ims_root;

--
-- Name: materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.materials_id_seq OWNED BY public.materials.id;


--
-- Name: notification_recipients; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.notification_recipients (
    id integer NOT NULL,
    notification_id integer NOT NULL,
    user_id integer NOT NULL,
    is_read boolean DEFAULT false,
    read_at timestamp with time zone,
    delivered_at timestamp with time zone,
    created_at timestamp with time zone
);


ALTER TABLE public.notification_recipients OWNER TO ims_root;

--
-- Name: COLUMN notification_recipients.notification_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notification_recipients.notification_id IS 'FK tới notifications';


--
-- Name: COLUMN notification_recipients.user_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notification_recipients.user_id IS 'Người nhận';


--
-- Name: COLUMN notification_recipients.is_read; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notification_recipients.is_read IS 'Đã đọc hay chưa';


--
-- Name: COLUMN notification_recipients.read_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notification_recipients.read_at IS 'Thời điểm đọc';


--
-- Name: COLUMN notification_recipients.delivered_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notification_recipients.delivered_at IS 'Thời điểm giao thông báo';


--
-- Name: notification_recipients_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.notification_recipients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notification_recipients_id_seq OWNER TO ims_root;

--
-- Name: notification_recipients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.notification_recipients_id_seq OWNED BY public.notification_recipients.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    message text,
    type character varying(50),
    related_work_id integer,
    related_project_id integer,
    is_system boolean DEFAULT false,
    action_url character varying(255),
    priority character varying(20) DEFAULT 'low'::character varying NOT NULL,
    meta json,
    created_at timestamp with time zone
);


ALTER TABLE public.notifications OWNER TO ims_root;

--
-- Name: COLUMN notifications.title; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notifications.title IS 'Tiêu đề thông báo';


--
-- Name: COLUMN notifications.message; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notifications.message IS 'Nội dung chi tiết';


--
-- Name: COLUMN notifications.type; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notifications.type IS 'Loại thông báo';


--
-- Name: COLUMN notifications.related_work_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notifications.related_work_id IS 'ID công việc liên quan (nếu có)';


--
-- Name: COLUMN notifications.related_project_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notifications.related_project_id IS 'ID dự án liên quan (nếu có)';


--
-- Name: COLUMN notifications.is_system; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notifications.is_system IS 'Là thông báo hệ thống (dành cho admin/dashboard) hay thông báo user?';


--
-- Name: COLUMN notifications.action_url; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notifications.action_url IS 'URL để xử lý hành động';


--
-- Name: COLUMN notifications.priority; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notifications.priority IS 'Mức độ ưu tiên của thông báo (high, medium, low)';


--
-- Name: COLUMN notifications.meta; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.notifications.meta IS 'Dữ liệu bổ sung cho thông báo (JSON)';


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO ims_root;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: office_locations; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.office_locations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type public.enum_office_locations_type DEFAULT 'office'::public.enum_office_locations_type,
    address text NOT NULL,
    phone character varying(20),
    working_hours character varying(100),
    latitude numeric(10,8) NOT NULL,
    longitude numeric(11,8) NOT NULL,
    radius integer DEFAULT 100,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone
);


ALTER TABLE public.office_locations OWNER TO ims_root;

--
-- Name: office_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.office_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.office_locations_id_seq OWNER TO ims_root;

--
-- Name: office_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.office_locations_id_seq OWNED BY public.office_locations.id;


--
-- Name: performance_metrics; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.performance_metrics (
    id integer NOT NULL,
    user_id integer NOT NULL,
    month timestamp with time zone NOT NULL,
    works_completed integer DEFAULT 0,
    works_total integer DEFAULT 0,
    on_time_percentage numeric(5,2),
    quality_score numeric(3,2),
    average_completion_time numeric(8,2),
    reports_submitted integer DEFAULT 0,
    created_at timestamp with time zone
);


ALTER TABLE public.performance_metrics OWNER TO ims_root;

--
-- Name: COLUMN performance_metrics.month; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.performance_metrics.month IS 'Tháng thống kê (chỉ cần năm và tháng)';


--
-- Name: performance_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.performance_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.performance_metrics_id_seq OWNER TO ims_root;

--
-- Name: performance_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.performance_metrics_id_seq OWNED BY public.performance_metrics.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(100) NOT NULL,
    description text,
    category character varying(50),
    is_deleted boolean DEFAULT false,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.permissions OWNER TO ims_root;

--
-- Name: COLUMN permissions.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.permissions.name IS 'Tên hiển thị quyền hạn bằng tiếng Việt: Tổng quan hệ thống, Chỉnh sửa công việc...';


--
-- Name: COLUMN permissions.code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.permissions.code IS 'Mã quyền hạn dùng trong logic: dashboard_permission, edit_work, approve_report...';


--
-- Name: COLUMN permissions.description; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.permissions.description IS 'Mô tả chi tiết về quyền hạn';


--
-- Name: COLUMN permissions.category; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.permissions.category IS 'Danh mục quyền hạn: user_management, work_management...';


--
-- Name: COLUMN permissions.is_deleted; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.permissions.is_deleted IS 'Soft delete flag';


--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.permissions_id_seq OWNER TO ims_root;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: position_roles; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.position_roles (
    id integer NOT NULL,
    position_id integer NOT NULL,
    role_id integer NOT NULL,
    is_primary boolean DEFAULT true,
    is_default boolean DEFAULT true,
    priority integer DEFAULT 0,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.position_roles OWNER TO ims_root;

--
-- Name: COLUMN position_roles.position_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.position_roles.position_id IS 'ID của chức vụ';


--
-- Name: COLUMN position_roles.role_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.position_roles.role_id IS 'ID của role';


--
-- Name: COLUMN position_roles.is_primary; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.position_roles.is_primary IS 'Role chính (mặc định gán cho nhân viên trong chức vụ)';


--
-- Name: COLUMN position_roles.is_default; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.position_roles.is_default IS 'Tự động assign khi nhân viên cập nhật chức vụ';


--
-- Name: COLUMN position_roles.priority; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.position_roles.priority IS 'Thứ tự ưu tiên (0 = cao nhất)';


--
-- Name: COLUMN position_roles.created_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.position_roles.created_at IS 'Thời điểm tạo';


--
-- Name: COLUMN position_roles.updated_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.position_roles.updated_at IS 'Thời điểm cập nhật';


--
-- Name: position_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.position_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.position_roles_id_seq OWNER TO ims_root;

--
-- Name: position_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.position_roles_id_seq OWNED BY public.position_roles.id;


--
-- Name: positions; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.positions (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(50),
    description text,
    department_id integer NOT NULL,
    level character varying(50) DEFAULT 'staff'::character varying,
    parent_position_id integer,
    salary_range_min numeric(15,2),
    salary_range_max numeric(15,2),
    expected_headcount integer DEFAULT 1,
    status public.enum_positions_status DEFAULT 'active'::public.enum_positions_status,
    is_deleted boolean DEFAULT false,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.positions OWNER TO ims_root;

--
-- Name: COLUMN positions.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.name IS 'Tên chức vụ';


--
-- Name: COLUMN positions.code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.code IS 'Mã chức vụ (vd: ENG001, MGR001)';


--
-- Name: COLUMN positions.description; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.description IS 'Mô tả chi tiết về chức vụ, trách nhiệm';


--
-- Name: COLUMN positions.department_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.department_id IS 'ID của phòng ban sở hữu chức vụ này';


--
-- Name: COLUMN positions.level; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.level IS 'Cấp độ chức vụ: intern, staff, senior, lead, manager, director';


--
-- Name: COLUMN positions.parent_position_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.parent_position_id IS 'ID của chức vụ cha (nếu có cấu trúc phân cấp)';


--
-- Name: COLUMN positions.salary_range_min; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.salary_range_min IS 'Mức lương tối thiểu cho chức vụ này';


--
-- Name: COLUMN positions.salary_range_max; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.salary_range_max IS 'Mức lương tối đa cho chức vụ này';


--
-- Name: COLUMN positions.expected_headcount; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.expected_headcount IS 'Số lượng nhân viên dự kiến cho chức vụ này';


--
-- Name: COLUMN positions.status; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.status IS 'Trạng thái: active, inactive, archived';


--
-- Name: COLUMN positions.is_deleted; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.is_deleted IS 'Soft delete flag';


--
-- Name: COLUMN positions.created_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.created_by IS 'Người tạo';


--
-- Name: COLUMN positions.updated_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.updated_by IS 'Người cập nhật';


--
-- Name: COLUMN positions.created_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.created_at IS 'Thời điểm tạo';


--
-- Name: COLUMN positions.updated_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.positions.updated_at IS 'Thời điểm cập nhật';


--
-- Name: positions_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.positions_id_seq OWNER TO ims_root;

--
-- Name: positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.positions_id_seq OWNED BY public.positions.id;


--
-- Name: project_history; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.project_history (
    id integer NOT NULL,
    project_id integer NOT NULL,
    action public.enum_project_history_action DEFAULT 'updated'::public.enum_project_history_action,
    field_changed character varying(100),
    old_values jsonb,
    new_values jsonb,
    changed_by integer,
    changed_at timestamp with time zone,
    notes text,
    ip_address character varying(45),
    user_agent text
);


ALTER TABLE public.project_history OWNER TO ims_root;

--
-- Name: COLUMN project_history.project_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.project_history.project_id IS 'Dự án';


--
-- Name: COLUMN project_history.field_changed; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.project_history.field_changed IS 'Tên trường thay đổi (nếu áp dụng)';


--
-- Name: COLUMN project_history.old_values; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.project_history.old_values IS 'Giá trị trước thay đổi';


--
-- Name: COLUMN project_history.new_values; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.project_history.new_values IS 'Giá trị sau thay đổi';


--
-- Name: COLUMN project_history.changed_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.project_history.changed_by IS 'Người thay đổi';


--
-- Name: COLUMN project_history.changed_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.project_history.changed_at IS 'Thời gian thay đổi';


--
-- Name: COLUMN project_history.notes; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.project_history.notes IS 'Ghi chú về thay đổi';


--
-- Name: project_history_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.project_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.project_history_id_seq OWNER TO ims_root;

--
-- Name: project_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.project_history_id_seq OWNED BY public.project_history.id;


--
-- Name: project_members; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.project_members (
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    project_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.project_members OWNER TO ims_root;

--
-- Name: project_team_members; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.project_team_members (
    id integer NOT NULL,
    project_id integer NOT NULL,
    user_id integer,
    name character varying(255),
    role character varying(100),
    days_worked integer DEFAULT 0,
    allocation_percent numeric(5,2) DEFAULT 0,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.project_team_members OWNER TO ims_root;

--
-- Name: COLUMN project_team_members.project_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.project_team_members.project_id IS 'ID dự án';


--
-- Name: COLUMN project_team_members.user_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.project_team_members.user_id IS 'ID user (nếu ứng viên là user hệ thống)';


--
-- Name: COLUMN project_team_members.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.project_team_members.name IS 'Tên thành viên';


--
-- Name: COLUMN project_team_members.role; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.project_team_members.role IS 'Vai trò trong dự án';


--
-- Name: COLUMN project_team_members.days_worked; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.project_team_members.days_worked IS 'Số ngày công đã làm';


--
-- Name: COLUMN project_team_members.allocation_percent; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.project_team_members.allocation_percent IS 'Phần trăm phân công (%)';


--
-- Name: project_team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.project_team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.project_team_members_id_seq OWNER TO ims_root;

--
-- Name: project_team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.project_team_members_id_seq OWNED BY public.project_team_members.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    status public.enum_projects_status DEFAULT 'active'::public.enum_projects_status,
    priority public.enum_projects_priority DEFAULT 'medium'::public.enum_projects_priority,
    progress numeric(5,2) DEFAULT 0,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    manager_id integer,
    budget numeric(13,2),
    spent numeric(13,2) DEFAULT 0,
    total_tasks integer DEFAULT 0,
    completed_tasks integer DEFAULT 0,
    overdue_tasks integer DEFAULT 0,
    pending_reports integer DEFAULT 0,
    planned_manpower integer DEFAULT 0,
    consumed_manpower integer DEFAULT 0,
    timeline jsonb,
    budget_details jsonb,
    created_by integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.projects OWNER TO ims_root;

--
-- Name: COLUMN projects.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.name IS 'Tên dự án';


--
-- Name: COLUMN projects.description; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.description IS 'Mô tả chi tiết dự án';


--
-- Name: COLUMN projects.status; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.status IS 'Trạng thái dự án';


--
-- Name: COLUMN projects.priority; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.priority IS 'Mức ưu tiên dự án';


--
-- Name: COLUMN projects.progress; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.progress IS 'Phần trăm tiến độ hoàn thành (0-100)';


--
-- Name: COLUMN projects.start_date; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.start_date IS 'Ngày bắt đầu dự án';


--
-- Name: COLUMN projects.end_date; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.end_date IS 'Ngày kết thúc dự án';


--
-- Name: COLUMN projects.manager_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.manager_id IS 'ID người quản lý dự án';


--
-- Name: COLUMN projects.budget; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.budget IS 'Ngân sách dự án (hỗ trợ giá trị lên đến chục tỷ)';


--
-- Name: COLUMN projects.spent; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.spent IS 'Số tiền đã chi tiêu (hỗ trợ giá trị lớn)';


--
-- Name: COLUMN projects.total_tasks; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.total_tasks IS 'Tổng số công việc trong dự án';


--
-- Name: COLUMN projects.completed_tasks; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.completed_tasks IS 'Số công việc đã hoàn thành';


--
-- Name: COLUMN projects.overdue_tasks; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.overdue_tasks IS 'Số công việc quá hạn';


--
-- Name: COLUMN projects.pending_reports; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.pending_reports IS 'Số báo cáo đang chờ xử lý';


--
-- Name: COLUMN projects.planned_manpower; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.planned_manpower IS 'Planned manpower (person-days)';


--
-- Name: COLUMN projects.consumed_manpower; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.consumed_manpower IS 'Consumed manpower (person-days)';


--
-- Name: COLUMN projects.timeline; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.timeline IS 'Timeline points e.g. [{month, progress, completed, manpower}]';


--
-- Name: COLUMN projects.budget_details; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.budget_details IS 'Budget breakdown by category: [{category, allocated, spent}]';


--
-- Name: COLUMN projects.created_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.created_by IS 'ID người tạo dự án';


--
-- Name: COLUMN projects.created_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.created_at IS 'Thời gian tạo bản ghi (tự động)';


--
-- Name: COLUMN projects.updated_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.projects.updated_at IS 'Thời gian cập nhật bản ghi cuối cùng (tự động)';


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.projects_id_seq OWNER TO ims_root;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.role_permissions (
    id integer NOT NULL,
    role_id integer NOT NULL,
    permission_id integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.role_permissions OWNER TO ims_root;

--
-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.role_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_permissions_id_seq OWNER TO ims_root;

--
-- Name: role_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.role_permissions_id_seq OWNED BY public.role_permissions.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    level integer DEFAULT 10,
    is_deleted boolean DEFAULT false,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.roles OWNER TO ims_root;

--
-- Name: COLUMN roles.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.roles.name IS 'Tên vai trò: admin, manager, sales, technician';


--
-- Name: COLUMN roles.description; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.roles.description IS 'Mô tả chi tiết về vai trò';


--
-- Name: COLUMN roles.level; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.roles.level IS 'Cấp độ vai trò';


--
-- Name: COLUMN roles.is_deleted; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.roles.is_deleted IS 'Soft delete flag';


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO ims_root;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sales_report_daily; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.sales_report_daily (
    id integer NOT NULL,
    report_code character varying(100) NOT NULL,
    sales_person_id integer NOT NULL,
    report_date timestamp with time zone NOT NULL,
    revenue numeric(10,2),
    cost numeric(10,2),
    profit numeric(10,2),
    notes text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.sales_report_daily OWNER TO ims_root;

--
-- Name: COLUMN sales_report_daily.report_code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.sales_report_daily.report_code IS 'Mã báo cáo bán hàng';


--
-- Name: COLUMN sales_report_daily.sales_person_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.sales_report_daily.sales_person_id IS 'Nhân viên kinh doanh';


--
-- Name: COLUMN sales_report_daily.report_date; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.sales_report_daily.report_date IS 'Ngày của báo cáo';


--
-- Name: COLUMN sales_report_daily.revenue; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.sales_report_daily.revenue IS 'Tổng doanh thu';


--
-- Name: COLUMN sales_report_daily.cost; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.sales_report_daily.cost IS 'Tổng chi phí';


--
-- Name: COLUMN sales_report_daily.profit; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.sales_report_daily.profit IS 'Tổng lợi nhuận';


--
-- Name: sales_report_daily_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.sales_report_daily_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sales_report_daily_id_seq OWNER TO ims_root;

--
-- Name: sales_report_daily_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.sales_report_daily_id_seq OWNED BY public.sales_report_daily.id;


--
-- Name: system_config; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.system_config (
    id integer NOT NULL,
    config_key character varying(100) NOT NULL,
    config_value text,
    config_type character varying(50),
    description text,
    updated_by integer,
    updated_at timestamp with time zone
);


ALTER TABLE public.system_config OWNER TO ims_root;

--
-- Name: COLUMN system_config.updated_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.system_config.updated_by IS 'Người cập nhật';


--
-- Name: system_config_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.system_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.system_config_id_seq OWNER TO ims_root;

--
-- Name: system_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.system_config_id_seq OWNED BY public.system_config.id;


--
-- Name: system_configs; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.system_configs (
    id integer NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    updated_by integer,
    updated_at timestamp with time zone
);


ALTER TABLE public.system_configs OWNER TO ims_root;

--
-- Name: COLUMN system_configs.settings; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.system_configs.settings IS 'Toàn bộ cài đặt hệ thống dưới dạng JSON';


--
-- Name: COLUMN system_configs.updated_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.system_configs.updated_by IS 'Người dùng cập nhật cài đặt';


--
-- Name: system_configs_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.system_configs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.system_configs_id_seq OWNER TO ims_root;

--
-- Name: system_configs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.system_configs_id_seq OWNED BY public.system_configs.id;


--
-- Name: technician_skills; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.technician_skills (
    id integer NOT NULL,
    technician_id integer NOT NULL,
    technician_level character varying(100) NOT NULL,
    assigned_at timestamp with time zone,
    created_at timestamp with time zone
);


ALTER TABLE public.technician_skills OWNER TO ims_root;

--
-- Name: COLUMN technician_skills.technician_level; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.technician_skills.technician_level IS 'Cấp bậc: Kỹ thuật chính, Kỹ thuật phụ, Kỹ thuật viên thực tập';


--
-- Name: COLUMN technician_skills.assigned_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.technician_skills.assigned_at IS 'Ngày phân công cấp bậc';


--
-- Name: technician_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.technician_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.technician_skills_id_seq OWNER TO ims_root;

--
-- Name: technician_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.technician_skills_id_seq OWNED BY public.technician_skills.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    assigned_by integer,
    assigned_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.user_roles OWNER TO ims_root;

--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_roles_id_seq OWNER TO ims_root;

--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.users (
    id integer NOT NULL,
    employee_id character varying(50),
    name character varying(255) NOT NULL,
    position_id integer,
    avatar_url text,
    phone character varying(20),
    email character varying(255),
    password character varying(255),
    zalo_id character varying(100),
    status character varying(50) DEFAULT 'active'::character varying,
    manager_id integer,
    is_active boolean DEFAULT true,
    approved public.enum_users_approved DEFAULT 'pending'::public.enum_users_approved,
    last_login timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO ims_root;

--
-- Name: COLUMN users.employee_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.employee_id IS 'Mã nhân viên (vd: EMP001) - nullable for Zalo users until approved';


--
-- Name: COLUMN users.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.name IS 'Tên đầy đủ của nhân viên';


--
-- Name: COLUMN users.position_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.position_id IS 'ID của chức vụ trong công ty';


--
-- Name: COLUMN users.avatar_url; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.avatar_url IS 'URL ảnh đại diện người dùng';


--
-- Name: COLUMN users.phone; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.phone IS 'Số điện thoại liên lạc';


--
-- Name: COLUMN users.email; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.email IS 'Email của người dùng';


--
-- Name: COLUMN users.password; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.password IS 'Mật khẩu đã hash';


--
-- Name: COLUMN users.zalo_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.zalo_id IS 'Zalo ID của người dùng';


--
-- Name: COLUMN users.status; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.status IS 'Trạng thái: active, inactive, suspended';


--
-- Name: COLUMN users.manager_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.manager_id IS 'ID của người quản lý trực tiếp';


--
-- Name: COLUMN users.is_active; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.is_active IS 'Tài khoản có hoạt động hay không';


--
-- Name: COLUMN users.approved; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.approved IS 'Trạng thái phê duyệt tài khoản: pending, approved, rejected';


--
-- Name: COLUMN users.last_login; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.last_login IS 'Thời điểm đăng nhập lần cuối';


--
-- Name: COLUMN users.created_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.created_at IS 'Thời điểm tạo bản ghi';


--
-- Name: COLUMN users.updated_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.users.updated_at IS 'Thời điểm cập nhật bản ghi lần cuối';


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO ims_root;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: work_assignments; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.work_assignments (
    id integer NOT NULL,
    work_id integer NOT NULL,
    technician_id integer NOT NULL,
    assigned_by integer NOT NULL,
    assignment_date timestamp with time zone,
    assigned_status public.enum_work_assignments_assigned_status DEFAULT 'pending'::public.enum_work_assignments_assigned_status,
    accepted_at timestamp with time zone,
    rejected_reason text,
    estimated_start_time timestamp with time zone,
    estimated_end_time timestamp with time zone,
    actual_start_time timestamp with time zone,
    actual_end_time timestamp with time zone,
    notes text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.work_assignments OWNER TO ims_root;

--
-- Name: COLUMN work_assignments.technician_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_assignments.technician_id IS 'Kỹ thuật viên được phân công';


--
-- Name: COLUMN work_assignments.assigned_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_assignments.assigned_by IS 'Người phân công';


--
-- Name: COLUMN work_assignments.assigned_status; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_assignments.assigned_status IS 'pending=chờ chấp nhận, accepted=đã nhận, rejected=từ chối, completed=hoàn thành';


--
-- Name: COLUMN work_assignments.accepted_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_assignments.accepted_at IS 'Thời điểm kỹ thuật viên chấp nhận';


--
-- Name: COLUMN work_assignments.rejected_reason; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_assignments.rejected_reason IS 'Lý do từ chối (nếu có)';


--
-- Name: COLUMN work_assignments.created_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_assignments.created_at IS 'Thời gian tạo bản ghi (tự động)';


--
-- Name: COLUMN work_assignments.updated_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_assignments.updated_at IS 'Thời gian cập nhật bản ghi cuối cùng (tự động)';


--
-- Name: work_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.work_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.work_assignments_id_seq OWNER TO ims_root;

--
-- Name: work_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.work_assignments_id_seq OWNED BY public.work_assignments.id;


--
-- Name: work_categories; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.work_categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.work_categories OWNER TO ims_root;

--
-- Name: COLUMN work_categories.name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_categories.name IS 'Tên danh mục công việc cụ thể';


--
-- Name: COLUMN work_categories.description; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_categories.description IS 'Mô tả chi tiết về danh mục';


--
-- Name: COLUMN work_categories.is_active; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_categories.is_active IS 'Danh mục có hoạt động hay không';


--
-- Name: work_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.work_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.work_categories_id_seq OWNER TO ims_root;

--
-- Name: work_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.work_categories_id_seq OWNED BY public.work_categories.id;


--
-- Name: work_history; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.work_history (
    id integer NOT NULL,
    work_id integer NOT NULL,
    action public.enum_work_history_action DEFAULT 'updated'::public.enum_work_history_action,
    field_changed character varying(100),
    old_values jsonb,
    new_values jsonb,
    changed_by integer,
    changed_at timestamp with time zone,
    notes text,
    ip_address character varying(45),
    user_agent text
);


ALTER TABLE public.work_history OWNER TO ims_root;

--
-- Name: COLUMN work_history.work_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_history.work_id IS 'Công việc';


--
-- Name: COLUMN work_history.action; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_history.action IS 'Hành động thay đổi';


--
-- Name: COLUMN work_history.field_changed; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_history.field_changed IS 'Tên trường thay đổi (nếu áp dụng)';


--
-- Name: COLUMN work_history.old_values; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_history.old_values IS 'Giá trị trước thay đổi';


--
-- Name: COLUMN work_history.new_values; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_history.new_values IS 'Giá trị sau thay đổi';


--
-- Name: COLUMN work_history.changed_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_history.changed_by IS 'Người thay đổi';


--
-- Name: COLUMN work_history.changed_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_history.changed_at IS 'Thời gian thay đổi';


--
-- Name: COLUMN work_history.notes; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_history.notes IS 'Ghi chú về thay đổi';


--
-- Name: work_history_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.work_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.work_history_id_seq OWNER TO ims_root;

--
-- Name: work_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.work_history_id_seq OWNED BY public.work_history.id;


--
-- Name: work_materials; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.work_materials (
    id integer NOT NULL,
    work_code character varying(64) NOT NULL,
    material_id integer NOT NULL,
    allocated_quantity numeric(14,2) DEFAULT 0,
    used_quantity numeric(14,2) DEFAULT 0,
    damaged_quantity numeric(14,2) DEFAULT 0,
    unit_price_snapshot numeric(12,2) DEFAULT 0,
    total_value_issued numeric(14,2) DEFAULT 0,
    technician_id integer,
    status public.enum_work_materials_status DEFAULT 'allocated'::public.enum_work_materials_status,
    notes text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.work_materials OWNER TO ims_root;

--
-- Name: COLUMN work_materials.work_code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_materials.work_code IS 'Mã công việc liên quan (work_code - chuỗi hệ thống)';


--
-- Name: COLUMN work_materials.material_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_materials.material_id IS 'ID vật tư';


--
-- Name: COLUMN work_materials.allocated_quantity; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_materials.allocated_quantity IS 'Số lượng đã xuất/allocated cho công việc';


--
-- Name: COLUMN work_materials.used_quantity; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_materials.used_quantity IS 'Tổng số đã dùng cho allocation này';


--
-- Name: COLUMN work_materials.damaged_quantity; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_materials.damaged_quantity IS 'Tổng số bị hỏng cho allocation này';


--
-- Name: COLUMN work_materials.unit_price_snapshot; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_materials.unit_price_snapshot IS 'Giá đơn vị khi xuất vật tư cho công việc';


--
-- Name: COLUMN work_materials.total_value_issued; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_materials.total_value_issued IS 'Tổng giá trị đã phát cho allocation này';


--
-- Name: COLUMN work_materials.technician_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_materials.technician_id IS 'ID kỹ thuật viên chịu trách nhiệm';


--
-- Name: COLUMN work_materials.status; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_materials.status IS 'Trạng thái allocation';


--
-- Name: COLUMN work_materials.notes; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_materials.notes IS 'Ghi chú dành cho allocation';


--
-- Name: COLUMN work_materials.created_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_materials.created_at IS 'Thời gian tạo';


--
-- Name: COLUMN work_materials.updated_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_materials.updated_at IS 'Thời gian cập nhật';


--
-- Name: work_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.work_materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.work_materials_id_seq OWNER TO ims_root;

--
-- Name: work_materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.work_materials_id_seq OWNED BY public.work_materials.id;


--
-- Name: work_reports; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.work_reports (
    id integer NOT NULL,
    work_id integer NOT NULL,
    project_id integer,
    reported_by integer NOT NULL,
    progress_percentage integer,
    status character varying(50) DEFAULT 'in_progress'::character varying,
    description text,
    notes text,
    photo_urls jsonb,
    location character varying(255),
    before_images jsonb,
    during_images jsonb,
    after_images jsonb,
    assigned_approver integer,
    materials_used text,
    issues_encountered text,
    solution_applied text,
    time_spent_hours numeric(5,2),
    next_steps text,
    submitted_by_role character varying(50),
    approval_status character varying(50) DEFAULT 'pending'::character varying,
    approved_by integer,
    approved_at timestamp with time zone,
    quality_rating integer,
    rejection_reason text,
    reported_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.work_reports OWNER TO ims_root;

--
-- Name: COLUMN work_reports.work_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.work_id IS 'ID công việc';


--
-- Name: COLUMN work_reports.project_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.project_id IS 'ID dự án';


--
-- Name: COLUMN work_reports.reported_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.reported_by IS 'ID người báo cáo';


--
-- Name: COLUMN work_reports.progress_percentage; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.progress_percentage IS 'Phần trăm hoàn thành (0-100)';


--
-- Name: COLUMN work_reports.status; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.status IS 'Trạng thái: in_progress, completed';


--
-- Name: COLUMN work_reports.description; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.description IS 'Mô tả chi tiết công việc đã làm';


--
-- Name: COLUMN work_reports.notes; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.notes IS 'Ghi chú thêm';


--
-- Name: COLUMN work_reports.photo_urls; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.photo_urls IS 'Danh sách URL ảnh chứng minh (JSON) - deprecated, sử dụng before_images, during_images, after_images';


--
-- Name: COLUMN work_reports.location; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.location IS 'Vị trí công việc';


--
-- Name: COLUMN work_reports.before_images; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.before_images IS 'Danh sách URL ảnh trước khi làm (JSON)';


--
-- Name: COLUMN work_reports.during_images; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.during_images IS 'Danh sách URL ảnh trong quá trình làm (JSON)';


--
-- Name: COLUMN work_reports.after_images; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.after_images IS 'Danh sách URL ảnh sau khi làm (JSON)';


--
-- Name: COLUMN work_reports.assigned_approver; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.assigned_approver IS 'ID người được giao phê duyệt';


--
-- Name: COLUMN work_reports.materials_used; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.materials_used IS 'Vật liệu, thiết bị sử dụng';


--
-- Name: COLUMN work_reports.issues_encountered; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.issues_encountered IS 'Các vấn đề/khó khăn gặp phải';


--
-- Name: COLUMN work_reports.solution_applied; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.solution_applied IS 'Giải pháp đã áp dụng';


--
-- Name: COLUMN work_reports.time_spent_hours; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.time_spent_hours IS 'Giờ công đã dùng';


--
-- Name: COLUMN work_reports.next_steps; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.next_steps IS 'Bước tiếp theo cần làm';


--
-- Name: COLUMN work_reports.submitted_by_role; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.submitted_by_role IS 'Vai trò người báo cáo';


--
-- Name: COLUMN work_reports.approval_status; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.approval_status IS 'Trạng thái phê duyệt: pending, approved, rejected';


--
-- Name: COLUMN work_reports.approved_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.approved_by IS 'ID người phê duyệt';


--
-- Name: COLUMN work_reports.approved_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.approved_at IS 'Thời điểm phê duyệt';


--
-- Name: COLUMN work_reports.quality_rating; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.quality_rating IS 'Đánh giá chất lượng (1-5 sao)';


--
-- Name: COLUMN work_reports.rejection_reason; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.rejection_reason IS 'Lý do từ chối báo cáo';


--
-- Name: COLUMN work_reports.reported_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.work_reports.reported_at IS 'Thời điểm báo cáo';


--
-- Name: work_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.work_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.work_reports_id_seq OWNER TO ims_root;

--
-- Name: work_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.work_reports_id_seq OWNED BY public.work_reports.id;


--
-- Name: works; Type: TABLE; Schema: public; Owner: ims_root
--

CREATE TABLE public.works (
    id integer NOT NULL,
    work_code character varying(64) NOT NULL,
    required_date timestamp with time zone NOT NULL,
    required_time_hour character varying(2),
    required_time_minute character varying(2),
    "timeSlot" integer,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    notes text,
    category_id integer NOT NULL,
    project_id integer,
    created_by_sales_id integer NOT NULL,
    created_by integer NOT NULL,
    priority public.enum_works_priority DEFAULT 'medium'::public.enum_works_priority,
    status public.enum_works_status DEFAULT 'pending'::public.enum_works_status,
    service_type character varying(100) DEFAULT 'Công việc dịch vụ'::character varying,
    due_date timestamp with time zone,
    created_date timestamp with time zone,
    completed_date timestamp with time zone,
    location character varying(255) NOT NULL,
    customer_name character varying(255) NOT NULL,
    customer_phone character varying(20) NOT NULL,
    customer_address text NOT NULL,
    location_lat numeric(10,8) NOT NULL,
    location_lng numeric(11,8) NOT NULL,
    estimated_hours numeric(5,2) NOT NULL,
    actual_hours numeric(5,2),
    estimated_cost numeric(13,2) NOT NULL,
    actual_cost numeric(13,2),
    payment_status public.enum_works_payment_status DEFAULT 'unpaid'::public.enum_works_payment_status,
    is_active boolean DEFAULT true,
    expires_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    customer_id integer,
    CONSTRAINT chk_works_estimated_cost CHECK (((estimated_cost >= (0)::numeric) AND (estimated_cost <= 9999999.99))),
    CONSTRAINT chk_works_estimated_hours CHECK (((estimated_hours >= (0)::numeric) AND (estimated_hours <= 999.99))),
    CONSTRAINT chk_works_location_lat CHECK (((location_lat >= ('-90'::integer)::numeric) AND (location_lat <= (90)::numeric))),
    CONSTRAINT chk_works_location_lng CHECK (((location_lng >= ('-180'::integer)::numeric) AND (location_lng <= (180)::numeric)))
);


ALTER TABLE public.works OWNER TO ims_root;

--
-- Name: COLUMN works.work_code; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.work_code IS 'Mã công việc duy nhất (chuỗi do hệ thống tạo)';


--
-- Name: COLUMN works.required_date; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.required_date IS 'Ngày yêu cầu thực hiện công việc (date only)';


--
-- Name: COLUMN works.required_time_hour; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.required_time_hour IS 'Giờ yêu cầu (HH)';


--
-- Name: COLUMN works.required_time_minute; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.required_time_minute IS 'Phút yêu cầu (MM)';


--
-- Name: COLUMN works."timeSlot"; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works."timeSlot" IS 'Time slot index / hour bucket để sắp xếp';


--
-- Name: COLUMN works.title; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.title IS 'Tiêu đề công việc';


--
-- Name: COLUMN works.description; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.description IS 'Mô tả chi tiết công việc';


--
-- Name: COLUMN works.notes; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.notes IS 'Ghi chú của công việc';


--
-- Name: COLUMN works.category_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.category_id IS 'ID danh mục công việc';


--
-- Name: COLUMN works.project_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.project_id IS 'ID dự án liên quan (nếu công việc thuộc một dự án cụ thể)';


--
-- Name: COLUMN works.created_by_sales_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.created_by_sales_id IS 'ID nhân viên kinh doanh tạo';


--
-- Name: COLUMN works.created_by; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.created_by IS 'ID người tạo công việc';


--
-- Name: COLUMN works.priority; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.priority IS 'Mức ưu tiên công việc';


--
-- Name: COLUMN works.status; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.status IS 'Trạng thái công việc';


--
-- Name: COLUMN works.service_type; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.service_type IS 'Loại dịch vụ cung cấp';


--
-- Name: COLUMN works.due_date; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.due_date IS 'Ngày hạn chót hoàn thành';


--
-- Name: COLUMN works.created_date; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.created_date IS 'Ngày tạo công việc';


--
-- Name: COLUMN works.completed_date; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.completed_date IS 'Ngày hoàn thành thực tế';


--
-- Name: COLUMN works.location; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.location IS 'Tên địa điểm công việc';


--
-- Name: COLUMN works.customer_name; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.customer_name IS 'Tên khách hàng';


--
-- Name: COLUMN works.customer_phone; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.customer_phone IS 'Số điện thoại khách hàng';


--
-- Name: COLUMN works.customer_address; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.customer_address IS 'Địa chỉ đầy đủ khách hàng';


--
-- Name: COLUMN works.location_lat; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.location_lat IS 'Vĩ độ GPS địa điểm công việc';


--
-- Name: COLUMN works.location_lng; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.location_lng IS 'Kinh độ GPS địa điểm công việc';


--
-- Name: COLUMN works.estimated_hours; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.estimated_hours IS 'Giờ công ước tính';


--
-- Name: COLUMN works.actual_hours; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.actual_hours IS 'Giờ công thực tế đã dùng';


--
-- Name: COLUMN works.estimated_cost; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.estimated_cost IS 'Chi phí ước tính';


--
-- Name: COLUMN works.actual_cost; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.actual_cost IS 'Chi phí thực tế';


--
-- Name: COLUMN works.payment_status; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.payment_status IS 'Trạng thái thanh toán';


--
-- Name: COLUMN works.is_active; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.is_active IS 'Công việc có hoạt động hay không';


--
-- Name: COLUMN works.expires_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.expires_at IS 'Ngày hết hạn công việc';


--
-- Name: COLUMN works.created_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.created_at IS 'Thời gian tạo bản ghi (tự động)';


--
-- Name: COLUMN works.updated_at; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.updated_at IS 'Thời gian cập nhật bản ghi cuối cùng (tự động)';


--
-- Name: COLUMN works.customer_id; Type: COMMENT; Schema: public; Owner: ims_root
--

COMMENT ON COLUMN public.works.customer_id IS 'ID khách hàng (nullable) liên kết với bảng customers';


--
-- Name: works_id_seq; Type: SEQUENCE; Schema: public; Owner: ims_root
--

CREATE SEQUENCE public.works_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.works_id_seq OWNER TO ims_root;

--
-- Name: works_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ims_root
--

ALTER SEQUENCE public.works_id_seq OWNED BY public.works.id;


--
-- Name: attachments id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attachments ALTER COLUMN id SET DEFAULT nextval('public.attachments_id_seq'::regclass);


--
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- Name: attendance_locations id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_locations ALTER COLUMN id SET DEFAULT nextval('public.attendance_locations_id_seq'::regclass);


--
-- Name: attendance_session_histories id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_session_histories ALTER COLUMN id SET DEFAULT nextval('public.attendance_session_histories_id_seq'::regclass);


--
-- Name: attendance_sessions id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_sessions ALTER COLUMN id SET DEFAULT nextval('public.attendance_sessions_id_seq'::regclass);


--
-- Name: attendance_type id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_type ALTER COLUMN id SET DEFAULT nextval('public.attendance_type_id_seq'::regclass);


--
-- Name: attendance_types id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_types ALTER COLUMN id SET DEFAULT nextval('public.attendance_types_id_seq'::regclass);


--
-- Name: check_in_types id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.check_in_types ALTER COLUMN id SET DEFAULT nextval('public.check_in_types_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: dashboard_metrics id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.dashboard_metrics ALTER COLUMN id SET DEFAULT nextval('public.dashboard_metrics_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: location_histories id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.location_histories ALTER COLUMN id SET DEFAULT nextval('public.location_histories_id_seq'::regclass);


--
-- Name: material_usages id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.material_usages ALTER COLUMN id SET DEFAULT nextval('public.material_usages_id_seq'::regclass);


--
-- Name: materials id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.materials ALTER COLUMN id SET DEFAULT nextval('public.materials_id_seq'::regclass);


--
-- Name: notification_recipients id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.notification_recipients ALTER COLUMN id SET DEFAULT nextval('public.notification_recipients_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: office_locations id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.office_locations ALTER COLUMN id SET DEFAULT nextval('public.office_locations_id_seq'::regclass);


--
-- Name: performance_metrics id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.performance_metrics ALTER COLUMN id SET DEFAULT nextval('public.performance_metrics_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: position_roles id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.position_roles ALTER COLUMN id SET DEFAULT nextval('public.position_roles_id_seq'::regclass);


--
-- Name: positions id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.positions ALTER COLUMN id SET DEFAULT nextval('public.positions_id_seq'::regclass);


--
-- Name: project_history id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.project_history ALTER COLUMN id SET DEFAULT nextval('public.project_history_id_seq'::regclass);


--
-- Name: project_team_members id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.project_team_members ALTER COLUMN id SET DEFAULT nextval('public.project_team_members_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.role_permissions ALTER COLUMN id SET DEFAULT nextval('public.role_permissions_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: sales_report_daily id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.sales_report_daily ALTER COLUMN id SET DEFAULT nextval('public.sales_report_daily_id_seq'::regclass);


--
-- Name: system_config id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.system_config ALTER COLUMN id SET DEFAULT nextval('public.system_config_id_seq'::regclass);


--
-- Name: system_configs id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.system_configs ALTER COLUMN id SET DEFAULT nextval('public.system_configs_id_seq'::regclass);


--
-- Name: technician_skills id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.technician_skills ALTER COLUMN id SET DEFAULT nextval('public.technician_skills_id_seq'::regclass);


--
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: work_assignments id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_assignments ALTER COLUMN id SET DEFAULT nextval('public.work_assignments_id_seq'::regclass);


--
-- Name: work_categories id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_categories ALTER COLUMN id SET DEFAULT nextval('public.work_categories_id_seq'::regclass);


--
-- Name: work_history id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_history ALTER COLUMN id SET DEFAULT nextval('public.work_history_id_seq'::regclass);


--
-- Name: work_materials id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_materials ALTER COLUMN id SET DEFAULT nextval('public.work_materials_id_seq'::regclass);


--
-- Name: work_reports id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_reports ALTER COLUMN id SET DEFAULT nextval('public.work_reports_id_seq'::regclass);


--
-- Name: works id; Type: DEFAULT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.works ALTER COLUMN id SET DEFAULT nextval('public.works_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public."SequelizeMeta" (name) FROM stdin;
001-create-users.js
002-create-roles.js
003-create-permissions.js
004-create-projects.js
005-create-work-categories.js
006-create-works.js
007-create-work-assignments.js
008-create-work-reports.js
009-create-work-history.js
011-create-technician-skills.js
012-create-attendance-session-history.js
012-create-employee-profiles.js
013-create-attendance-session.js
013-create-attendance-type.js
013-create-check-ins.js
014-create-attachments.js
014-create-attendance.js
014-create-location-histories.js
015-create-office-locations.js
016-create-role-permissions.js
017-create-sales-report-daily.js
018-create-performance-metrics.js
019-create-user-roles.js
020-create-dashboard-metrics.js
021-create-system-config.js
022-create-notifications.js
023-create-materials.js
024-create-material-usages.js
025-create-work-materials.js
026-remove-materials-project-work.js
027-add-material-composite-indexes.js
028-add-unique-constraint-work_materials.js
029-create-customers.js
030-add-department-support.js
031-create-positions.js
032-create-position-roles.js
033-add-user-position-fk.js
034-create-notification-recipients.js
035-create-attendance-locations.js
036-create-attendance-types.js
\.


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.attachments (id, work_id, report_id, file_name, file_url, file_type, file_size, uploaded_by, uploaded_at) FROM stdin;
\.


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.attendance (id, user_id, work_id, project_id, attendance_session_id, parent_attendance_id, check_in_time, check_out_time, latitude, longitude, location_name, address, photo_url, status, distance_from_work, is_within_radius, duration_minutes, device_info, ip_address, notes, check_in_type_id, violation_distance, technicians, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: attendance_locations; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.attendance_locations (id, location_code, name, type, address, latitude, longitude, radius, icon, is_active, notes, created_at, updated_at) FROM stdin;
1	warehouse	Văn phòng Proshop - Daikin	warehouse	89 Lê Thị Riêng, Phường Thới An, Quận 12, TP.HCM	10.86571654	106.65439575	70	zi-home	t	Văn phòng chính của Proshop - Daikin	2025-01-01 07:00:00+07	2025-01-01 07:00:00+07
2	warehouse2	Kho Vật Tư LQD - Quận 12	warehouse	189a Đ. TX 25, Thạnh Xuân, Quận 12, TP.HCM	10.87963635	106.66332006	70	zi-home	t	Kho vật tư chính của công ty LQD	2025-01-01 07:00:00+07	2025-01-01 07:00:00+07
\.


--
-- Data for Name: attendance_session_histories; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.attendance_session_histories (id, original_id, user_id, work_id, project_id, started_at, ended_at, status, duration_minutes, check_in_id, check_out_id, attendee_user_ids, notes, metadata, archived_at, archived_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: attendance_sessions; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.attendance_sessions (id, user_id, work_id, project_id, started_at, ended_at, status, duration_minutes, check_in_id, check_out_id, notes, metadata, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: attendance_technicians; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.attendance_technicians (created_at, updated_at, attendance_id, user_id) FROM stdin;
\.


--
-- Data for Name: attendance_type; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.attendance_type (id, code, name, default_duration_minutes, start_time, end_time, description, active, created_at, updated_at) FROM stdin;
1	regular	Chấm công bình thường	480	08:00:00	17:00:00	Ca làm việc hành chính	t	2025-01-01 07:00:00+07	2025-12-31 14:15:19.081+07
2	overtime	Làm thêm	120	\N	\N	Làm thêm giờ	t	2025-01-01 07:00:00+07	2025-12-31 14:15:19.081+07
3	sick_leave	Nghỉ ốm	\N	\N	\N	Nghỉ phép/ốm	t	2025-01-01 07:00:00+07	2025-12-31 14:15:19.081+07
\.


--
-- Data for Name: attendance_types; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.attendance_types (id, code, name, "time", is_active, notes, created_at, updated_at) FROM stdin;
1	REGULAR	Chấm Công Ca Ngày	08:00 - 17:00	t	\N	2025-12-31 14:15:19.107+07	2025-12-31 14:15:19.107+07
2	NIGHT_SHIFT	Chấm Công Ca Đêm	22:00 - 06:00	t	\N	2025-12-31 14:15:19.107+07	2025-12-31 14:15:19.107+07
3	OVERTIME_AFTER	Tăng Ca Ngoài Giờ	17:00 - 22:00	t	\N	2025-12-31 14:15:19.107+07	2025-12-31 14:15:19.107+07
4	OVERTIME_LUNCH	Tăng Ca Trưa	11:30 - 13:00	t	\N	2025-12-31 14:15:19.107+07	2025-12-31 14:15:19.107+07
\.


--
-- Data for Name: check_in_types; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.check_in_types (id, code, name, default_duration_minutes, start_time, end_time, description, active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.customers (id, customer_code, name, phone, email, address, is_active, customer_status, customer_type, total_works, last_work_date, contact_person, contact_position, account_manager_id, account_manager_name, industry, tax_id, website, payment_terms, contract_start, contract_end, last_contact_date, location_lat, location_lng, notes, created_by, created_at, updated_at) FROM stdin;
1	c_001	Công Ty TNHH Công Nghệ ABC	0901234567	contact@abc.com	123 Đường Pasteur, Quận 1, TP.HCM	t	normal	doanh nghiệp	0	\N	Nguyễn Văn A	Giám đốc Kinh Doanh	1	Nhân viên 1	Công Nghệ Thông Tin	0101234567	https://abc.com.vn	Net 30	2024-01-15 07:00:00+07	2025-01-15 07:00:00+07	2025-12-20 07:00:00+07	10.75800000	106.65150000	Khách hàng VIP, hợp tác lâu dài	1	2024-12-20 17:00:00+07	2025-12-20 17:00:00+07
2	c_002	Công Ty Cổ Phần Xây Dựng XYZ	0902345678	info@xyz.com	456 Đường Trần Hưng Đạo, Quận 5, TP.HCM	t	normal	doanh nghiệp	0	\N	Trần Thị B	Trưởng Phòng Kỹ Thuật	2	Nhân viên 2	Xây Dựng	0102345678	https://xyz.com.vn	Net 45	2024-03-01 07:00:00+07	2025-03-01 07:00:00+07	2025-12-18 07:00:00+07	10.74510000	106.65900000	Dự án lớn, yêu cầu bảo hành	1	2024-12-22 18:30:00+07	2025-12-22 18:30:00+07
3	c_003	Cửa Hàng Điện Tử Minh Khai	0903456789	shop@minhkhai.com	789 Đường Nguyễn Huệ, Quận 1, TP.HCM	t	normal	khách lẻ	0	\N	Lê Văn C	Chủ Cửa Hàng	3	Nhân viên 3	Bán Lẻ Điện Tử	\N	\N	Thanh toán ngay	\N	\N	2025-12-15 07:00:00+07	10.77690000	106.69780000	Khách hàng thân thiết, mua hàng thường xuyên	1	2024-12-25 21:15:00+07	2025-12-25 21:15:00+07
4	c_004	Trung Tâm Y Tế Lạc Hồng	0904567890	contact@lachong.com.vn	321 Đường Hoa Hồng, Quận 11, TP.HCM	t	normal	doanh nghiệp	0	\N	Phạm Thị D	Quản Lý Tổng Hợp	1	Nhân viên 1	Y Tế	0103456789	https://lachong.com.vn	Net 60	2024-06-10 07:00:00+07	2025-06-10 07:00:00+07	2025-12-19 07:00:00+07	10.72890000	106.67470000	Hợp đồng bảo trì thiết bị y tế	1	2025-01-05 16:00:00+07	2025-12-20 16:00:00+07
5	c_005	Công Ty Quản Lý Bất Động Sản Golden	0905678901	admin@golden.com.vn	654 Đường Lê Văn Sỹ, Quận 3, TP.HCM	t	normal	doanh nghiệp	0	\N	Võ Minh E	Giám Đốc Kỹ Thuật	2	Nhân viên 2	Bất Động Sản	0104567890	https://golden.com.vn	Net 30	2024-08-01 07:00:00+07	2025-08-01 07:00:00+07	2025-12-17 07:00:00+07	10.78150000	106.68600000	Hợp đồng bảo trì hệ thống CCTV	1	2025-01-20 17:30:00+07	2025-12-20 17:30:00+07
6	c_006	Nhà Hàng Sen Vàng	0906789012	booking@senvang.com	987 Đường Điện Biên Phủ, Quận 1, TP.HCM	t	normal	khách lẻ	0	\N	Đinh Văn F	Chủ Nhà Hàng	3	Nhân viên 3	Nhà Hàng & Quán Ăn	\N	https://senvang.com	Thanh toán ngay	\N	\N	2025-12-16 07:00:00+07	10.76710000	106.67290000	Khách hàng mới, cần tư vấn về bảo trì	1	2025-02-10 20:45:00+07	2025-12-20 20:45:00+07
7	c_007	Trường Đại Học Kinh Tế TP.HCM	0907890123	contact@hce.edu.vn	59E Đường Đinh Tiên Hoàng, Quận 1, TP.HCM	t	normal	doanh nghiệp	0	\N	Bùi Thị G	Trưởng Phòng CNTT	1	Nhân viên 1	Giáo Dục	0105678901	https://hce.edu.vn	Net 45	2024-09-01 07:00:00+07	2025-09-01 07:00:00+07	2025-12-14 07:00:00+07	10.77290000	106.69830000	Hợp đồng bảo trì hệ thống mạng	1	2025-03-15 15:00:00+07	2025-12-20 15:00:00+07
8	c_008	Siêu Thị Điện Máy Ngôi Sao	0908901234	service@sao.com.vn	123 Đường Trần Xuân Soạn, Quận 7, TP.HCM	t	normal	đại lý	0	\N	Hồ Minh H	Quản Lý Kỹ Thuật	2	Nhân viên 2	Bán Lẻ Điện Máy	0106789012	https://sao.com.vn	Net 30	2024-10-01 07:00:00+07	2025-10-01 07:00:00+07	2025-12-21 07:00:00+07	10.71780000	106.70620000	Đại lý lớn, có nhu cầu bảo trì thường xuyên	1	2025-04-05 18:20:00+07	2025-12-21 18:20:00+07
9	c_009	Tòa Nhà Văn Phòng Sunlight	0909012345	facility@sunlight.com.vn	456 Đường Nguyễn Hữu Cảnh, Quận Bình Thạnh, TP.HCM	t	normal	doanh nghiệp	0	\N	Ngô Minh I	Trưởng Phòng Vận Hành	3	Nhân viên 3	Quản Lý Tòa Nhà	0107890123	https://sunlight.com.vn	Net 30	2024-07-15 07:00:00+07	2025-07-15 07:00:00+07	2025-12-20 07:00:00+07	10.80870000	106.74590000	Hợp đồng bảo trì hệ thống điện và HVAC	1	2025-05-12 22:30:00+07	2025-12-20 22:30:00+07
10	c_010	Công Ty Sản Xuất Nhôm Nhập Khẩu Việt	0910123456	factory@vnaluminum.com	789 Đường Kinh Dương Vương, Quận 6, TP.HCM	t	normal	doanh nghiệp	0	\N	Phan Văn K	Giám Đốc Sản Xuất	1	Nhân viên 1	Sản Xuất	0108901234	https://vnaluminum.com	Net 60	2024-05-20 07:00:00+07	2025-05-20 07:00:00+07	2025-12-19 07:00:00+07	10.74110000	106.64500000	Khách hàng lâu năm, bảo trì định kỳ	1	2025-06-08 16:15:00+07	2025-12-20 16:15:00+07
11	c_011	Dược Phẩm Quốc Tế Hòa Bình	0911234567	sales@hoabinh.com.vn	321 Đường Tôn Đức Thắng, Quận 1, TP.HCM	t	prospect	doanh nghiệp	0	\N	Dương Thị L	Trưởng Phòng Kinh Doanh	2	Nhân viên 2	Dược Phẩm	0109012345	https://hoabinh.com.vn	\N	\N	\N	2025-12-12 07:00:00+07	10.76130000	106.70430000	Khách hàng tiềm năng, chưa ký hợp đồng	1	2025-07-22 17:45:00+07	2025-12-12 17:45:00+07
12	c_012	Khách Sạn Hoa Đỏ	0912345678	contact@hoadohotel.com	654 Đường Lê Thánh Tông, Quận 1, TP.HCM	t	normal	khách lẻ	0	\N	Tạ Nguyên M	Quản Lý Khách Sạn	3	Nhân viên 3	Khách Sạn & Du Lịch	\N	https://hoadohotel.com	Thanh toán 15 ngày	\N	\N	2025-12-10 07:00:00+07	10.78900000	106.70210000	Hợp tác dự án nâng cấp hệ thống	1	2025-08-30 19:00:00+07	2025-12-20 19:00:00+07
13	c_013	Công Ty Logistics Tận Tâm	0913456789	info@tantan.com.vn	987 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM	t	normal	doanh nghiệp	0	\N	Ưu Minh N	Giám Đốc Điều Hành	1	Nhân viên 1	Logistics & Vận Chuyển	0110123456	https://tantan.com.vn	Net 30	2025-01-10 07:00:00+07	2026-01-10 07:00:00+07	2025-12-18 07:00:00+07	10.77040000	106.68130000	Khách hàng mới, hợp đồng năm 2025	1	2025-09-18 21:30:00+07	2025-12-20 21:30:00+07
14	c_014	Ngân Hàng Ticibank Việt Nam	0914567890	support@ticibank.com.vn	123 Đường Bùi Viện, Quận 1, TP.HCM	t	normal	doanh nghiệp	0	\N	Bình Văn O	Giám Đốc CNTT	2	Nhân viên 2	Ngân Hàng & Tài Chính	0111234567	https://ticibank.com.vn	Net 30	2024-04-01 07:00:00+07	2025-04-01 07:00:00+07	2025-12-21 07:00:00+07	10.76300000	106.68840000	Khách hàng VIP, bảo trì 24/7	1	2025-10-05 16:00:00+07	2025-12-21 16:00:00+07
15	c_015	Công Ty Kiến Trúc & Thiết Kế IDS	0915678901	contact@ids.com.vn	456 Đường Nguyễn Thị Minh Khai, Quận 1, TP.HCM	t	normal	doanh nghiệp	0	\N	Khoa Văn P	Giám Đốc Dự Án	3	Nhân viên 3	Kiến Trúc & Thiết Kế	0112345678	https://ids.com.vn	Net 45	2024-11-01 07:00:00+07	2025-11-01 07:00:00+07	2025-12-15 07:00:00+07	10.77560000	106.69810000	Dự án lớn, nhiều công việc phức tạp	1	2025-11-02 17:30:00+07	2025-12-20 17:30:00+07
16	c_016	Trang Trại Nông Nghiệp Sạch Vàng	0916789012	info@sangtrai.com.vn	789 Quốc Lộ 1A, Tỉnh Long An	f	normal	khách lẻ	0	\N	Nguyễn Văn Q	Chủ Trang Trại	1	Nhân viên 1	Nông Nghiệp	\N	\N	Thanh toán ngay	\N	\N	2025-11-20 07:00:00+07	10.53500000	106.37890000	Khách hàng không còn hợp tác	1	2025-12-01 15:00:00+07	2025-12-15 15:00:00+07
17	c_017	Trung Tâm Đào Tạo Lập Trình Tech	0917890123	admin@techtraining.com.vn	321 Đường Thạch Thị Thanh, Quận 1, TP.HCM	t	normal	doanh nghiệp	0	\N	Ryo Văn R	Trưởng Phòng Vận Hành	2	Nhân viên 2	Giáo Dục - Đào Tạo	0113456789	https://techtraining.com.vn	Net 30	2024-12-01 07:00:00+07	2025-12-01 07:00:00+07	2025-12-20 07:00:00+07	10.76800000	106.70050000	Cơ sở đào tạo, yêu cầu hỗ trợ CNTT	1	2025-12-05 18:45:00+07	2025-12-20 18:45:00+07
18	c_018	Công Ty Lắp Ráp Linh Kiện Điện Tử	0918901234	contact@assembly.com.vn	654 Đường Ngã Tư Ga, Quận 1, TP.HCM	t	normal	doanh nghiệp	0	\N	Sang Thị S	Quản Lý Chất Lượng	3	Nhân viên 3	Sản Xuất Điện Tử	0114567890	https://assembly.com.vn	Net 60	2024-08-15 07:00:00+07	2025-08-15 07:00:00+07	2025-12-14 07:00:00+07	10.75420000	106.68880000	Nhà máy lớn, hợp đồng bảo trì định kỳ	1	2025-12-08 20:20:00+07	2025-12-20 20:20:00+07
19	c_019	Studio Thiết Kế Đồ Họa Creative	0919012345	info@creativestudio.com	987 Đường Võ Văn Kiệt, Quận 1, TP.HCM	t	normal	khách lẻ	0	\N	Tí Văn T	Chủ Studio	1	Nhân viên 1	Sáng Tạo & Thiết Kế	\N	https://creativestudio.com	Thanh toán 50% trước	\N	\N	2025-12-16 07:00:00+07	10.76010000	106.67770000	Khách hàng nhỏ, yêu cầu chuyên biệt	1	2025-12-10 22:00:00+07	2025-12-20 22:00:00+07
20	c_020	Công Ty Kinh Doanh Nước Sạch	0920123456	sales@cleanwater.com.vn	123 Đường Phạm Văn Chí, Quận 6, TP.HCM	f	suspended	doanh nghiệp	0	\N	Ưởng Văn U	Giám Đốc Bán Hàng	2	Nhân viên 2	Nước Sạch & Xử Lý Nước	0115678901	https://cleanwater.com.vn	Net 45	2024-02-01 07:00:00+07	2025-02-01 07:00:00+07	2025-11-05 07:00:00+07	10.73200000	106.64210000	Tạm ngưng hợp tác, chờ thương lượng lại	1	2025-12-12 16:30:00+07	2025-12-15 16:30:00+07
\.


--
-- Data for Name: dashboard_metrics; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.dashboard_metrics (id, user_id, metric_date, metric_type, metric_value, metric_json, created_at) FROM stdin;
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.departments (id, name, code, description, manager_id, phone, email, location, parent_department_id, status, is_deleted, created_by, updated_by, created_at, updated_at) FROM stdin;
1	Phòng Kỹ Thuật	TECH	Bộ phận phát triển và hỗ trợ kỹ thuật	\N	0901-000-001	tech@company.com	Tầng 2, Toà A	\N	active	f	1	1	2025-12-31 14:15:19.117+07	2025-12-31 14:15:19.117+07
2	Phòng Kinh Doanh	SALES	Bộ phận kinh doanh và bán hàng	\N	0901-000-002	sales@company.com	Tầng 1, Toà A	\N	active	f	1	1	2025-12-31 14:15:19.117+07	2025-12-31 14:15:19.117+07
3	Phòng Nhân Sự	HR	Bộ phận quản lý nhân sự và phát triển	\N	0901-000-003	hr@company.com	Tầng 3, Toà A	\N	active	f	1	1	2025-12-31 14:15:19.117+07	2025-12-31 14:15:19.117+07
4	Phòng IT	IT	Bộ phận quản lý hệ thống công nghệ thông tin	\N	0901-000-004	it@company.com	Tầng 3, Toà A	\N	active	f	1	1	2025-12-31 14:15:19.117+07	2025-12-31 14:15:19.117+07
5	Phòng Kỹ Sư Thiết Kế	DESIGN	Bộ phận thiết kế kỹ thuật	\N	0901-000-005	design@company.com	Tầng 3, Toà A	\N	active	f	1	1	2025-12-31 14:15:19.117+07	2025-12-31 14:15:19.117+07
\.


--
-- Data for Name: employee_profiles; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.employee_profiles (user_id, specialization, certification, phone_secondary, address, date_of_birth, gender, id_number, hire_date, contract_date, bank_account_number, bank_name, total_experience_years, performance_rating, daily_salary, is_active, created_at, updated_at, department_id) FROM stdin;
\.


--
-- Data for Name: location_histories; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.location_histories (id, user_id, latitude, longitude, accuracy, status, "timestamp", device_info, created_at) FROM stdin;
1	2	21.02870000	105.80490000	5.00	working	2025-12-31 14:10:19.104+07	Android 11 - App v1.2.3	2025-12-19 15:05:00+07
2	3	21.03010000	105.80010000	6.50	offline	2025-12-31 13:15:19.104+07	iOS 15 - App v1.2.3	2025-12-19 14:10:00+07
\.


--
-- Data for Name: material_usages; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.material_usages (id, material_id, work_code, sub_work_name, technician_id, technician_name, used_quantity, usage_type, unit_price, total_value, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: materials; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.materials (id, material_code, code, name, description, unit, quantity, used_quantity, damaged_quantity, unit_price, reorder_level, status, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notification_recipients; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.notification_recipients (id, notification_id, user_id, is_read, read_at, delivered_at, created_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.notifications (id, title, message, type, related_work_id, related_project_id, is_system, action_url, priority, meta, created_at) FROM stdin;
\.


--
-- Data for Name: office_locations; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.office_locations (id, name, type, address, phone, working_hours, latitude, longitude, radius, is_active, created_at) FROM stdin;
1	Văn phòng chính	office	Tầng 5, Tòa nhà Z, Hà Nội	+84 24 1234 5678	08:00-17:00	21.02851100	105.80481700	150	t	2025-01-01 07:00:00+07
\.


--
-- Data for Name: performance_metrics; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.performance_metrics (id, user_id, month, works_completed, works_total, on_time_percentage, quality_score, average_completion_time, reports_submitted, created_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.permissions (id, name, code, description, category, is_deleted, created_at, updated_at) FROM stdin;
1	Tổng quan hệ thống	bang_dieu_khien	Truy cập trang Tổng quan hệ thống chính	general	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
2	Thông Báo	thong_bao	Xem và quản lý thông báo hệ thống	general	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
3	Lịch Làm Việc	lich_lam_viec	Xem và quản lý lịch làm việc	general	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
4	Bản Đồ Theo Dõi Công Việc	ban_do_theo_doi_cong_viec	Truy cập bản đồ theo dõi vị trí công việc	tracking	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
5	Theo Dõi Công Việc	theo_doi_cong_viec	Xem và theo dõi các công việc	tracking	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
6	Theo Dõi Dự Án	theo_doi_du_an	Quản lý và theo dõi các dự án	tracking	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
7	Báo Cáo Theo Dõi	bao_cao_theo_doi	Xem báo cáo theo dõi công việc	tracking	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
8	Chi Tiết Chấm Công	chi_tiet_cham_cong	Xem chi tiết chấm công nhân viên	attendance	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
9	Tổng Quan Chấm Công	tong_quan_cham_cong	Xem tổng quan chấm công	attendance	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
10	Quản Lý Nhân Sự	quan_ly_nhan_su	Quản lý thông tin nhân viên	attendance	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
11	Quản Lý Người Dùng	quan_ly_nguoi_dung	Tạo, chỉnh sửa, xóa người dùng	user	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
12	Tổng quan hệ thống Hiệu Suất	bang_dieu_khien_hieu_suat	Xem thống kê hiệu suất tổng quan	analytics	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
13	Hiệu Suất Kỹ Thuật Viên	hieu_suat_ky_thuat_vien	Xem hiệu suất của kỹ thuật viên	analytics	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
14	Báo Cáo Chi Tiết	bao_cao_chi_tiet	Truy cập báo cáo chi tiết	analytics	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
15	Lịch Sử Dữ Liệu	lich_su_du_lieu	Xem lịch sử dữ liệu hệ thống	analytics	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
16	Quản Lý Phòng Ban	quan_ly_phong_ban	Quản lý cấu trúc tổ chức	organization	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
17	Xem Báo Cáo	xem_bao_cao	Truy cập và xuất báo cáo	report	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
18	Cài Đặt Hệ Thống	cai_dat_he_thong	Thay đổi cài đặt toàn hệ thống	system	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
19	Nhật Ký Hệ Thống	nhat_ky_he_thong	Xem lịch sử hoạt động hệ thống	system	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
20	Sao Lưu & Khôi Phục	sao_luu_va_khoi_phuc	Quản lý sao lưu dữ liệu	system	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
21	Vai Trò & Quyền Hạn	vai_tro_va_quyen_han	Quản lý vai trò và quyền hạn người dùng	admin	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
22	Cài Đặt Tích Hợp	cai_dat_tich_hop	Cấu hình tích hợp với hệ thống bên ngoài	admin	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
23	Truy Cập Mini App	access_mini_app	Cho phép truy cập ứng dụng mini app	general	f	2023-01-01 07:00:00+07	2025-12-31 14:15:19.062+07
\.


--
-- Data for Name: position_roles; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.position_roles (id, position_id, role_id, is_primary, is_default, priority, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: positions; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.positions (id, name, code, description, department_id, level, parent_position_id, salary_range_min, salary_range_max, expected_headcount, status, is_deleted, created_by, updated_by, created_at, updated_at) FROM stdin;
1	Trưởng Phòng Kỹ Thuật	MGR-TECH	Chịu trách nhiệm quản lý Phòng Kỹ Thuật	1	manager	\N	3500.00	6000.00	1	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
2	Kỹ Thuật Chính	SR-TECH	Kỹ thuật chính chịu trách nhiệm các tác vụ chuyên môn	1	senior	\N	1800.00	2800.00	2	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
3	Kỹ Thuật Phụ	JR-TECH	Nhân viên kỹ thuật hỗ trợ và vận hành	1	staff	\N	1000.00	1600.00	4	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
4	Trưởng Nhóm Kỹ Thuật	LEAD-TECH	Lãnh đạo nhóm kỹ thuật	1	lead	\N	2200.00	3200.00	1	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
5	Giám đốc Công Nghệ	DIR-IT	Chịu trách nhiệm toàn bộ bộ phận công nghệ	4	director	\N	5000.00	8000.00	1	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
6	Quản lý Dự Án	MGR-IT-PM	Quản lý các dự án phát triển phần mềm	4	manager	\N	3000.00	4500.00	1	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
7	Kỹ Sư Phần Mềm Cao Cấp	SR-ENG-IT	Kỹ sư phần mềm cấp cao, xử lý dự án phức tạp	4	senior	\N	1800.00	2600.00	2	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
8	Kỹ Sư Phần Mềm	ENG-IT	Kỹ sư phần mềm phát triển tính năng	4	staff	\N	1200.00	1800.00	3	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
9	Trưởng Phòng Thiết Kế	MGR-DESIGN	Quản lý bộ phận thiết kế kỹ thuật	5	manager	\N	3200.00	5000.00	1	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
10	Kỹ Sư Thiết Kế Chính	SR-DESIGN	Kỹ sư thiết kế chính phụ trách bản vẽ và công nghệ	5	senior	\N	1600.00	2600.00	2	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
11	Kỹ Sư Thiết Kế	ENG-DESIGN	Kỹ sư thiết kế thực hiện bản vẽ và mô phỏng	5	staff	\N	1100.00	1700.00	3	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
12	Giám đốc Kinh Doanh	DIR-SALES	Chịu trách nhiệm toàn bộ bộ phận kinh doanh	2	director	\N	4500.00	7000.00	1	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
13	Quản lý Bán Hàng	MGR-SALES	Quản lý nhóm bán hàng và khách hàng	2	manager	\N	2500.00	3800.00	1	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
14	Trưởng Nhóm Bán Hàng	LEAD-SALES	Lãnh đạo nhóm bán hàng khu vực	2	lead	\N	1800.00	2600.00	1	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
15	Nhân Viên Bán Hàng	SALES-REP	Nhân viên bán hàng phát triển khách hàng mới	2	staff	\N	1000.00	1600.00	3	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
16	Giám đốc Nhân Sự	DIR-HR	Chịu trách nhiệm toàn bộ bộ phận nhân sự	3	director	\N	4000.00	6500.00	1	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
17	Quản lý Tuyển Dụng	MGR-RECRUIT	Quản lý quy trình tuyển dụng và onboarding	3	manager	\N	2000.00	3000.00	1	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
18	Chuyên Viên Tuyển Dụng	SPECIALIST-RECRUIT	Tìm kiếm, phỏng vấn và tuyển dụng nhân viên	3	senior	\N	1400.00	2000.00	2	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
19	Nhân Viên Hành Chính Nhân Sự	HR-ADMIN	Xử lý công việc hành chính và hỗ trợ nhân sự	3	staff	\N	1000.00	1500.00	1	active	f	1	1	2025-12-31 14:15:19.121+07	2025-12-31 14:15:19.121+07
\.


--
-- Data for Name: project_history; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.project_history (id, project_id, action, field_changed, old_values, new_values, changed_by, changed_at, notes, ip_address, user_agent) FROM stdin;
\.


--
-- Data for Name: project_members; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.project_members (created_at, updated_at, project_id, user_id) FROM stdin;
\.


--
-- Data for Name: project_team_members; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.project_team_members (id, project_id, user_id, name, role, days_worked, allocation_percent, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.projects (id, name, description, status, priority, progress, start_date, end_date, manager_id, budget, spent, total_tasks, completed_tasks, overdue_tasks, pending_reports, planned_manpower, consumed_manpower, timeline, budget_details, created_by, created_at, updated_at) FROM stdin;
1	Lắp đặt hệ thống VRF - Tòa nhà A	Lắp đặt hệ thống điều hòa VRF cho tòa nhà văn phòng, gồm thiết bị, ống gió, và cân chỉnh hệ thống	active	high	25.00	2025-11-01 07:00:00+07	2026-02-15 07:00:00+07	2	350000000.00	50000000.00	120	30	2	1	800	200	[{"month": "2025-11", "manpower": 100, "progress": 10, "completed": 12}, {"month": "2025-12", "manpower": 100, "progress": 25, "completed": 30}]	[{"spent": 40000000, "category": "Equipment", "allocated": 250000000}, {"spent": 10000000, "category": "Labor", "allocated": 80000000}]	1	2025-11-01 07:00:00+07	2025-12-31 14:15:19.085+07
2	Nâng cấp cụm máy lạnh Chiller - Trung tâm B	Thay thế cụm chiller và cải tạo hệ thống làm mát cho trung tâm thương mại	in_progress	high	5.50	2026-03-01 07:00:00+07	2026-06-30 07:00:00+07	3	1200000000.00	0.00	60	0	0	0	1200	0	[]	[{"spent": 0, "category": "Chiller", "allocated": 900000000}, {"spent": 0, "category": "Installation", "allocated": 300000000}]	1	2025-12-01 07:00:00+07	2025-12-31 14:15:19.085+07
3	Hoàn thiện hệ thống ống gió và HVAC - Trung tâm Thương mại C	Thi công ống gió, ống hút, và lắp đặt hệ thống HVAC toàn khu vực sảnh chính	active	medium	40.00	2025-10-15 07:00:00+07	2026-01-31 07:00:00+07	4	500000000.00	150000000.00	200	80	5	2	600	240	[{"month": "2025-10", "manpower": 80, "progress": 10, "completed": 20}, {"month": "2025-11", "manpower": 160, "progress": 40, "completed": 80}]	[{"spent": 60000000, "category": "Ducting", "allocated": 200000000}, {"spent": 80000000, "category": "Labor", "allocated": 150000000}]	2	2025-10-15 07:00:00+07	2025-12-31 14:15:19.085+07
4	Lắp đặt hệ thống VRF & điều hòa - Khu căn hộ D	Cung cấp và lắp đặt hệ thống điều hòa cho toàn bộ block căn hộ	active	high	10.00	2025-12-01 07:00:00+07	2026-04-01 07:00:00+07	3	800000000.00	40000000.00	150	15	0	0	700	70	[{"month": "2025-12", "manpower": 30, "progress": 5, "completed": 5}]	[{"spent": 30000000, "category": "Units", "allocated": 500000000}, {"spent": 10000000, "category": "Labor", "allocated": 300000000}]	3	2025-12-01 07:00:00+07	2025-12-31 14:15:19.085+07
5	Hợp đồng bảo trì hệ thống điều hòa - Bệnh viện E	Hợp đồng 12 tháng: bảo trì, vệ sinh, và kiểm tra hiệu năng hệ thống điều hòa	active	low	0.00	2026-01-01 07:00:00+07	2026-12-31 07:00:00+07	1	150000000.00	0.00	12	0	0	0	120	0	[]	[{"spent": 0, "category": "Maintenance", "allocated": 150000000}]	4	2025-12-15 07:00:00+07	2025-12-31 14:15:19.085+07
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.role_permissions (id, role_id, permission_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.roles (id, name, description, level, is_deleted, created_by, updated_by, created_at, updated_at) FROM stdin;
1	Quản trị viên	Vai trò quản trị viên với quyền cao nhất	1	f	1	1	2025-12-06 14:58:29.579+07	2025-12-06 14:58:29.579+07
2	Quản lý	Quản lý nhân sự và báo cáo	2	f	1	1	2025-12-06 15:09:24.652+07	2025-12-06 15:09:24.652+07
3	Nhân viên kinh doanh	Truy cập cơ bản cho nhân viên kinh doanh	3	f	1	1	2025-12-06 15:09:41.18+07	2025-12-06 15:09:41.18+07
4	Kỹ thuật viên	Xem báo cáo kỹ thuật	4	f	1	1	2025-12-06 15:10:06.103+07	2025-12-06 15:10:06.103+07
\.


--
-- Data for Name: sales_report_daily; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.sales_report_daily (id, report_code, sales_person_id, report_date, revenue, cost, profit, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: system_config; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.system_config (id, config_key, config_value, config_type, description, updated_by, updated_at) FROM stdin;
\.


--
-- Data for Name: system_configs; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.system_configs (id, settings, updated_by, updated_at) FROM stdin;
\.


--
-- Data for Name: technician_skills; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.technician_skills (id, technician_id, technician_level, assigned_at, created_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.user_roles (id, user_id, role_id, assigned_by, assigned_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.users (id, employee_id, name, position_id, avatar_url, phone, email, password, zalo_id, status, manager_id, is_active, approved, last_login, created_at, updated_at) FROM stdin;
1	EMP001	Nhân viên 1	\N	\N	0397364664	dat.nglt@gmail.com	0397364664	\N	active	1	t	approved	\N	2025-12-06 14:56:29.4+07	2025-12-06 14:56:29.4+07
2	EMP002	Nhân viên 2	\N	\N	0987654321	tech2@example.com	0987654321	\N	active	1	t	approved	\N	2025-12-10 15:00:00+07	2025-12-10 15:00:00+07
3	EMP003	Nhân viên 3	\N	\N	0987000111	tech3@example.com	0987000111	\N	active	1	t	approved	\N	2025-12-10 16:00:00+07	2025-12-10 16:00:00+07
4	EMP004	Nhân viên 4	\N	\N	0787000111	tech4@example.com	0787000111	\N	active	1	t	approved	\N	2025-12-10 16:00:00+07	2025-12-10 16:00:00+07
5	EMP005	Nhân viên 5	\N	\N	0797000222	tech5@example.com	0797000222	\N	active	1	t	approved	\N	2025-12-11 15:00:00+07	2025-12-11 15:00:00+07
6	EMP006	Nhân viên 6	\N	\N	0797000333	staff6@example.com	0797000333	\N	active	1	t	approved	\N	2025-12-12 15:00:00+07	2025-12-12 15:00:00+07
7	EMP007	Nhân viên 7	\N	\N	0797000444	staff7@example.com	0797000444	\N	active	1	t	approved	\N	2025-12-13 15:00:00+07	2025-12-13 15:00:00+07
8	EMP008	Nhân viên 8	\N	\N	0797000555	staff8@example.com	0797000555	\N	active	1	t	approved	\N	2025-12-14 15:00:00+07	2025-12-14 15:00:00+07
9	EMP009	Nhân viên 9	\N	\N	0797000666	staff9@example.com	0797000666	\N	active	1	t	approved	\N	2025-12-15 15:00:00+07	2025-12-15 15:00:00+07
10	EMP010	Nhân viên 10	\N	\N	0797000777	staff10@example.com	0797000777	\N	active	1	t	approved	\N	2025-12-16 15:00:00+07	2025-12-16 15:00:00+07
\.


--
-- Data for Name: work_assignments; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.work_assignments (id, work_id, technician_id, assigned_by, assignment_date, assigned_status, accepted_at, rejected_reason, estimated_start_time, estimated_end_time, actual_start_time, actual_end_time, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: work_categories; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.work_categories (id, name, description, is_active, created_at, updated_at) FROM stdin;
1	Khảo sát – Tư vấn	Dịch vụ khảo sát địa điểm, tư vấn giải pháp	t	2025-01-01 07:00:00+07	2025-01-01 07:00:00+07
2	Giao hàng – Vận chuyển	Dịch vụ giao hàng và vận chuyển thiết bị	t	2025-01-01 07:00:00+07	2025-01-01 07:00:00+07
3	Lắp đặt máy lạnh dân dụng	Lắp đặt máy lạnh cho khu dân cư	t	2025-01-01 07:00:00+07	2025-01-01 07:00:00+07
4	Lắp đặt hệ thống	Lắp đặt hệ thống máy lạnh thi công trọn gói	t	2025-01-01 07:00:00+07	2025-01-01 07:00:00+07
5	Bảo trì – Bảo dưỡng	Dịch vụ bảo trì định kỳ và bảo dưỡng máy	t	2025-01-01 07:00:00+07	2025-01-01 07:00:00+07
6	Sửa chữa – Khắc phục sự cố	Dịch vụ sửa chữa và khắc phục sự cố	t	2025-01-01 07:00:00+07	2025-01-01 07:00:00+07
7	Tháo dỡ – Di dời	Dịch vụ tháo dỡ, di dời máy lạnh	t	2025-01-01 07:00:00+07	2025-01-01 07:00:00+07
8	Thi công phụ trợ (ống đồng, điện, nước, ống gió)	Dịch vụ thi công công trình phụ trợ	t	2025-01-01 07:00:00+07	2025-01-01 07:00:00+07
9	Nghiệm thu – Bàn giao	Dịch vụ nghiệm thu và bàn giao công trình	t	2025-01-01 07:00:00+07	2025-01-01 07:00:00+07
10	Bảo hành – Hậu mãi	Dịch vụ bảo hành và hỗ trợ hậu mãi	t	2025-01-01 07:00:00+07	2025-01-01 07:00:00+07
\.


--
-- Data for Name: work_history; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.work_history (id, work_id, action, field_changed, old_values, new_values, changed_by, changed_at, notes, ip_address, user_agent) FROM stdin;
\.


--
-- Data for Name: work_materials; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.work_materials (id, work_code, material_id, allocated_quantity, used_quantity, damaged_quantity, unit_price_snapshot, total_value_issued, technician_id, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: work_reports; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.work_reports (id, work_id, project_id, reported_by, progress_percentage, status, description, notes, photo_urls, location, before_images, during_images, after_images, assigned_approver, materials_used, issues_encountered, solution_applied, time_spent_hours, next_steps, submitted_by_role, approval_status, approved_by, approved_at, quality_rating, rejection_reason, reported_at, created_at, updated_at) FROM stdin;
1	1	1	2	50	in_progress	Ngày 1 của công việc lắp đặt máy lạnh multi-split: Đã hoàn thành khâu khảo sát địa điểm, thiết kế đường ống, lắp dàn nóng và bắt đầu lắp dàn lạnh phòng 1. Tất cả vật liệu có sẵn, công ty xây dựng đã chuẩn bị điểm neo.	Tiến độ bình thường. Dự kiến hoàn thành ngày mai. Khách hàng rất hài lòng với chất lượng công việc.	\N	ABC Company - Văn phòng TP.HCM	["https://via.placeholder.com/400x300?text=Before+Image+1", "https://via.placeholder.com/400x300?text=Before+Image+2"]	["https://via.placeholder.com/400x300?text=During+Image+1", "https://via.placeholder.com/400x300?text=During+Image+2", "https://via.placeholder.com/400x300?text=During+Image+3"]	\N	1	Dàn lạnh LG 9000BTU x2, Dàn nóng LG 18000BTU, Ống đồng 1/4-3/8, Dây điện 2.5mm2, Gas R410A (8kg), Keo chống cháy	\N	\N	4.00	Tiếp tục lắp dàn lạnh phòng 2 và 3, nạp gas, kiểm tra toàn hệ thống	technician	pending	\N	\N	\N	\N	2025-12-19 23:30:00+07	2025-12-19 23:30:00+07	2025-12-19 23:30:00+07
2	2	1	3	100	completed	Công việc bảo trì định kỳ hoàn tất thành công. Thực hiện các công việc: Vệ sinh bộ lọc không khí (4 bộ), kiểm tra gas (kiểm tra áp suất thấp 4.2 bar - bình thường), kiểm tra dòng điện (bình thường), làm sạch dàn nóng (không có vặn bị tích tụ), bơm nước thoát nước (thông thoáng), kiểm tra van kỳ và các linh kiện khác (tất cả bình thường).	Hệ thống máy lạnh XYZ Ltd. ở trạng thái rất tốt, không phát hiện vấn đề gì. Khuyến cáo tiếp tục bảo trì 6 tháng một lần. Khách hàng rất thỏa mãn.	\N	XYZ Ltd. - Kho hàng Hà Nội	["https://via.placeholder.com/400x300?text=AC+Before+1", "https://via.placeholder.com/400x300?text=AC+Before+2"]	["https://via.placeholder.com/400x300?text=Maintenance+During+1", "https://via.placeholder.com/400x300?text=Maintenance+During+2"]	["https://via.placeholder.com/400x300?text=AC+After+1", "https://via.placeholder.com/400x300?text=AC+After+2"]	1	Tinh dầu bảo trì, Dung dịch vệ sinh ống dẫn, Gas R410A (0.5kg)	\N	\N	3.50	Không cần. Hoàn thành công việc.	technician	approved	1	2025-12-18 21:00:00+07	5	\N	2025-12-18 20:00:00+07	2025-12-18 20:00:00+07	2025-12-18 21:00:00+07
3	4	1	3	75	in_progress	Công việc lắp đặt máy sấy quần áo công nghiệp: Đã hoàn thành 75%. Thực hiện: Khảo sát địa điểm, lắp khung sắt cơ sở, kết nối ống nước vào và thoát, chuẩn bị hệ thống điện 3 pha. Còn lại: kiểm tra lại kết nối, nạp nước, chạy thử nghiệm.	Công việc tiến hành bình thường. Dự kiến hoàn thành sáng hôm sau. Vừa phát hiện cần thêm ống nước thoát dài 2m (sẽ chuẩn bị trong buổi sáng).	\N	DEF Factory - Nhà máy Hải Phòng	["https://via.placeholder.com/400x300?text=Factory+Before"]	["https://via.placeholder.com/400x300?text=Installation+Progress+1", "https://via.placeholder.com/400x300?text=Installation+Progress+2"]	\N	1	Máy sấy công nghiệp 50kg, Khung sắt lắp ráp, Ống nước PVC 3/4, Cầu chì điện 3 pha 63A, Dây điện 6mm2	Cần thêm ống nước thoát thêm 2m	Đã liên hệ với nhân viên kho để chuẩn bị ống nước thêm	6.00	Hoàn thành lắp đặt, nạp nước, chạy thử nghiệm 2 giờ, kiểm tra các chỉ số	technician	pending	\N	\N	\N	\N	2025-12-21 00:00:00+07	2025-12-21 00:00:00+07	2025-12-21 00:00:00+07
4	7	1	3	100	completed	Hoàn thành kiểm tra hệ thống điện toàn bộ công ty GHI. Công việc bao gồm: Kiểm tra chỉ số điện áp 3 pha (tất cả bình thường 220V), kiểm tra độ cân bằng tải (cân bằng tốt), kiểm tra mối nối (chặt lại 3 mối nối lỏng), kiểm tra bảng điều khiển chính (hoạt động tốt), kiểm tra hệ thống nối đất (điện trở 0.8 Ω - bình thường).	Toàn bộ hệ thống điện ở tình trạng tốt. Không phát hiện vấn đề nghiêm trọng nào. Khuyến cáo kiểm tra lại 12 tháng một lần.	\N	GHI Company - Xưởng sản xuất Bình Dương	["https://via.placeholder.com/400x300?text=Electrical+Panel+Before"]	["https://via.placeholder.com/400x300?text=Testing+1", "https://via.placeholder.com/400x300?text=Testing+2"]	["https://via.placeholder.com/400x300?text=Panel+After"]	1	Thiết bị đo đa năng, Tuốc nơ vít, Hơi nén	\N	\N	3.50	Không có	technician	rejected	1	2025-12-15 17:30:00+07	\N	Báo cáo thiếu dữ liệu chi tiết về điện áp từng pha. Yêu cầu bổ sung báo cáo chi tiết.	2025-12-15 19:00:00+07	2025-12-15 19:00:00+07	2025-12-15 17:30:00+07
5	7	1	3	100	completed	Báo cáo bổ sung chi tiết. Hoàn thành kiểm tra hệ thống điện toàn bộ công ty GHI. Chi tiết điện áp:\n- Pha A: 219V\n- Pha B: 220V\n- Pha C: 221V\nĐộ không cân bằng tối đa: 0.9% (bình thường < 5%)\nKiểm tra mối nối: chặt lại 3 mối nối ở bảng chính\nHệ thống nối đất: 0.8 Ω (bình thường)\nBảng điều khiển: hoạt động bình thường, không quá tải\nTất cả thiết bị điện: hoạt động bình thường	Hệ thống điện ở tình trạng tốt. Khuyến cáo kiểm tra 12 tháng một lần. Khách hàng thỏa mãn.	\N	GHI Company - Xưởng sản xuất Bình Dương	["https://via.placeholder.com/400x300?text=Electrical+Panel+Before"]	["https://via.placeholder.com/400x300?text=Testing+Detail+1", "https://via.placeholder.com/400x300?text=Testing+Detail+2", "https://via.placeholder.com/400x300?text=Data+Sheet"]	["https://via.placeholder.com/400x300?text=Panel+After"]	1	Thiết bị đo đa năng	\N	\N	0.50	Không có	technician	approved	1	2025-12-15 18:00:00+07	5	\N	2025-12-15 18:00:00+07	2025-12-15 18:00:00+07	2025-12-15 18:00:00+07
6	10	1	3	100	completed	Hoàn tất công việc kiểm tra và vệ sinh bộ lọc không khí công ty JKL. Thực hiện: Mở hộp lọc, kiểm tra độ bẩn (tích bụi 15%), vệ sinh bằng nước sạch và hơi nén, kiểm tra độ thông (tốt), lắp lại bộ lọc, kiểm tra lưu lượng không khí (bình thường), ghi chú các vị trí tích bụi.	Bộ lọc không khí ở tình trạng tốt. Khuyến cáo thay bộ lọc mới trong 6 tháng nữa (khi tích bụi 30-40%). Khách hàng hài lòng với chất lượng dịch vụ.	\N	JKL Company - Văn phòng Đà Nẵng	["https://via.placeholder.com/400x300?text=Filter+Dirty+1", "https://via.placeholder.com/400x300?text=Filter+Dirty+2"]	["https://via.placeholder.com/400x300?text=Cleaning+Process+1", "https://via.placeholder.com/400x300?text=Cleaning+Process+2"]	["https://via.placeholder.com/400x300?text=Filter+Clean+1", "https://via.placeholder.com/400x300?text=Filter+Clean+2"]	1	Nước sạch, Hơi nén, Bàn chải mềm	\N	\N	2.00	Không có. Khách hàng sẽ liên hệ khi cần thay bộ lọc mới.	technician	approved	1	2025-12-18 19:30:00+07	5	\N	2025-12-18 18:45:00+07	2025-12-18 18:45:00+07	2025-12-18 19:30:00+07
7	3	1	2	0	in_progress	Công việc sửa chữa máy lạnh chưa bắt đầu. Đã chuẩn bị đầy đủ: Gas R410A (8kg), Dàn nóng thay thế, Các linh kiện cần thiết. Chờ khách hàng xác nhận lịch làm việc chính thức.	Chuẩn bị sẵn sàng. Chờ xác nhận từ khách hàng. Dự kiến bắt đầu ngày 22/12/2025.	\N	MNO Corporation - Văn phòng Cần Thơ	["https://via.placeholder.com/400x300?text=AC+System+Before+1", "https://via.placeholder.com/400x300?text=AC+System+Before+2"]	\N	\N	1	Dàn nóng thay thế, Gas R410A (8kg), Ống đồng, Dây điện, Keo chống cháy	\N	\N	0.00	Chờ xác nhận từ khách hàng, sau đó bắt đầu tháo dàn nóng cũ	technician	pending	\N	\N	\N	\N	2025-12-21 23:00:00+07	2025-12-21 23:00:00+07	2025-12-21 23:00:00+07
8	9	1	2	35	in_progress	Công việc sửa chữa hệ thống tuần hoàn nước: Đã hoàn thành 35%. Thực hiện: Tắt hệ thống, kiểm tra van điều chỉnh (bị kẹt, cần thay thế), tháo van, kiểm tra bộ lọc (bẩn, cần vệ sinh), vệ sinh bộ lọc. Còn lại: Thay van mới, lắp lại, nạp nước, chạy thử.	Phát hiện van kỳ bị kẹt, cần thay thế với van mới chất lượng cao. Đã mua van thay thế. Dự kiến hoàn thành trong 2 ngày.	\N	PQR Hotel - Bể bơi Nha Trang	["https://via.placeholder.com/400x300?text=Circulation+System+Before"]	["https://via.placeholder.com/400x300?text=Valve+Problem+1", "https://via.placeholder.com/400x300?text=Filter+Cleaning"]	\N	1	Van điều chỉnh mới, Bộ vệ sinh hệ thống, Dây buộc, Keo chống rò rỉ	Van kỳ bị kẹt, không thể mở được	Thay van kỳ mới	2.50	Thay van kỳ mới, lắp lại hệ thống, nạp nước sạch, chạy thử hệ thống 2 giờ	technician	pending	\N	\N	\N	\N	2025-12-25 21:30:00+07	2025-12-25 21:30:00+07	2025-12-25 21:30:00+07
\.


--
-- Data for Name: works; Type: TABLE DATA; Schema: public; Owner: ims_root
--

COPY public.works (id, work_code, required_date, required_time_hour, required_time_minute, "timeSlot", title, description, notes, category_id, project_id, created_by_sales_id, created_by, priority, status, service_type, due_date, created_date, completed_date, location, customer_name, customer_phone, customer_address, location_lat, location_lng, estimated_hours, actual_hours, estimated_cost, actual_cost, payment_status, is_active, expires_at, created_at, updated_at, customer_id) FROM stdin;
1	LQD-WORK-001	2025-12-19 07:00:00+07	08	00	8	Lắp đặt máy lạnh thi công trọn gói	Lắp đặt hệ thống máy lạnh multi-split cho văn phòng 2 tầng tại ABC Company, bao gồm: 4 dàn lạnh trong nhà, 2 dàn nóng ngoài trời, đường ống đồng, dây điện cấp, và các phụ kiện kèm theo. Bảo hành 5 năm	\N	1	1	1	1	high	completed	Công việc dịch vụ	2025-12-25 07:00:00+07	2025-12-10 16:00:00+07	\N	ABC Company - Văn phòng TP.HCM	ABC Company	0900111222	123 Đường A, Quận B, TP.HCM	10.87010000	106.66250000	8.00	\N	8500000.00	\N	unpaid	t	\N	2025-12-10 16:00:00+07	2025-12-10 16:00:00+07	\N
2	LQD-WORK-002	2025-12-18 07:00:00+07	09	00	9	Bảo trì định kỳ máy lạnh	Bảo trì định kỳ 4 dàn lạnh multi-split tại XYZ Ltd. Bao gồm: vệ sinh bộ lọc, kiểm tra gas, kiểm tra dòng điện, làm sạch dàn nóng, bơm nước thoát nước, kiểm tra van kỳ và các linh kiện	\N	2	1	1	1	medium	completed	Công việc dịch vụ	2025-12-20 07:00:00+07	2025-12-01 16:00:00+07	2025-12-18 20:00:00+07	XYZ Ltd. - Kho hàng Hà Nội	XYZ Ltd.	0900222333	456 Đường C, Quận D, Hà Nội	21.02850000	105.85420000	4.00	3.50	1200000.00	1050000.00	paid	t	\N	2025-12-01 16:00:00+07	2025-12-18 20:00:00+07	\N
3	LQD-WORK-003	2025-12-20 07:00:00+07	07	30	7	Sửa chữa máy lạnh - thay thế dàn nóng	Sửa chữa máy lạnh multi-split bị hỏng dàn nóng. Tiến hành: tháo dàn nóng, kiểm tra hệ thống, thay thế dàn nóng mới, nạp gas R410A, kiểm tra lại toàn hệ thống, vận hành thử 30 phút	\N	3	1	1	1	urgent	in_progress	Công việc dịch vụ	2025-12-23 07:00:00+07	2025-12-19 17:00:00+07	\N	Công ty ABC - Trụ sở chính	Công ty ABC	0900333444	789 Đường E, Quận F, TP.HCM	10.85500000	106.67500000	6.00	2.50	3500000.00	\N	unpaid	t	\N	2025-12-19 17:00:00+07	2025-12-20 18:00:00+07	\N
4	LQD-WORK-004	2025-12-22 07:00:00+07	08	00	8	Lắp đặt máy lạnh âm trần cassette	Lắp đặt máy lạnh âm trần cassette 3 chiều cho phòng họp lớn. Bao gồm: thi công, cắt trần, lắp máy, đấu điện, nạp gas, kiểm tra. Công suất 28000 BTU, tiêu chuẩn Y tế	\N	1	1	1	1	high	pending	Công việc dịch vụ	2025-12-27 07:00:00+07	2025-12-15 21:00:00+07	\N	Tòa nhà Hạng B, phòng họp tầng 5	Công ty XYZ	0900444555	321 Đường G, Quận H, Hà Nội	21.02000000	105.86000000	5.00	\N	5200000.00	\N	unpaid	t	\N	2025-12-15 21:00:00+07	2025-12-15 21:00:00+07	\N
5	LQD-WORK-005	2025-12-17 07:00:00+07	14	30	14	Nạp gas máy lạnh - R410A	Nạp gas máy lạnh multi-split hết gas do rò rỉ. Kiểm tra áp suất, sửa chữa điểm rò rỉ, nạp gas R410A 6kg, kiểm tra lại áp suất, vận hành kiểm tra nhiệt độ lạnh, cấp hóa đơn bảo hành 6 tháng	\N	2	1	1	1	urgent	completed	Công việc dịch vụ	2025-12-19 07:00:00+07	2025-12-08 21:00:00+07	2025-12-17 23:15:00+07	Nhà hàng Hoàng Kim - TP.HCM	Nhà hàng Hoàng Kim	0900555666	654 Đường I, Quận J, TP.HCM	10.86000000	106.65000000	2.00	1.75	1500000.00	1400000.00	paid	t	\N	2025-12-08 21:00:00+07	2025-12-17 23:15:00+07	\N
6	LQD-WORK-006	2025-12-14 07:00:00+07	10	00	10	Vệ sinh máy lạnh - bảo trì định kỳ	Vệ sinh đầy đủ máy lạnh 6 bộ cho căn hộ. Bao gồm: tháo bộ lọc vệ sinh sạch, làm sạch tường dàn lạnh, làm sạch dàn nóng, kiểm tra đồng hồ gas, kiểm tra dòng điện, bơm nước thoát, kiểm tra van kỳ	\N	2	1	1	1	medium	completed	Công việc dịch vụ	2025-12-17 07:00:00+07	2025-12-08 17:00:00+07	2025-12-14 20:00:00+07	Căn hộ Landmark 81 - TP.HCM	Gia đình Nguyễn Văn A	0900666777	987 Đường K, Quận L, TP.HCM	10.79200000	106.70100000	3.00	3.00	900000.00	900000.00	partial	t	\N	2025-12-08 17:00:00+07	2025-12-14 20:00:00+07	\N
7	LQD-WORK-007	2025-12-21 07:00:00+07	09	00	9	Lắp đặt máy lạnh tủ đứng	Lắp đặt máy lạnh tủ đứng 2 chiều 18000 BTU cho phòng hợp nhỏ. Bao gồm: thi công, đấu điện 3 pha, nạp gas, kiểm tra, bảo hành 3 năm máy, 1 năm dịch vụ	\N	1	1	1	1	high	completed	Công việc dịch vụ	2025-12-24 07:00:00+07	2025-12-12 16:00:00+07	\N	Trụ sở Công ty GHI - Bình Dương	Công ty GHI	0900777888	147 Đường M, Quận N, Bình Dương	10.80500000	106.75900000	4.00	\N	4200000.00	\N	unpaid	t	\N	2025-12-12 16:00:00+07	2025-12-12 16:00:00+07	\N
8	LQD-WORK-008	2025-12-13 07:00:00+07	13	00	13	Sửa chữa máy lạnh - dàn lạnh chảy nước	Sửa chữa máy lạnh bị chảy nước từ dàn lạnh. Kiểm tra van kỳ, kiểm tra ống thoát nước, làm sạch ống thoát, thay thế ống thoát nước nếu bị tắc hoặc hỏng, kiểm tra lại, vận hành thử	\N	3	1	1	1	high	completed	Công việc dịch vụ	2025-12-16 07:00:00+07	2025-12-13 20:00:00+07	2025-12-13 21:30:00+07	Văn phòng Công ty JKL - Vũng Tàu	Công ty JKL	0900888999	258 Đường O, Quận P, Vũng Tàu	10.34310000	107.08410000	2.00	1.50	800000.00	700000.00	paid	t	\N	2025-12-13 20:00:00+07	2025-12-13 21:30:00+07	\N
9	LQD-WORK-009	2025-12-23 07:00:00+07	09	00	9	Tối ưu hóa hệ thống máy lạnh	Phân tích và tối ưu hóa hiệu suất hệ thống máy lạnh multi-split. Kiểm tra áp suất gas, kiểm tra dòng điện, đo nhiệt độ bên ngoài/trong, cải thiện lưu thông khí, kiểm tra tất cả van kỳ, tối ưu hóa công suất	\N	2	1	1	1	medium	in_progress	Công việc dịch vụ	2025-12-28 07:00:00+07	2025-12-16 16:00:00+07	\N	Trung tâm thương mại LIM Center	Công ty MNO	0900999000	369 Đường Q, Hóc Môn, TP.HCM	10.87000000	106.63000000	6.00	2.50	2000000.00	\N	unpaid	t	\N	2025-12-16 16:00:00+07	2025-12-20 17:00:00+07	\N
10	LQD-WORK-010	2026-01-05 07:00:00+07	08	00	8	Tư vấn và lắp đặt máy lạnh nhà mới	Tư vấn, thiết kế và lắp đặt hệ thống máy lạnh toàn bộ cho nhà mới 250m2. Bao gồm: tư vấn giải pháp, thiết kế lưu thông khí, cắt tường, lắp ống đồng, dây điện, nạp gas, kiểm tra chất lượng, cấp hóa đơn, bảo hành 5 năm	\N	1	1	1	1	high	pending	Công việc dịch vụ	2026-01-10 07:00:00+07	2025-12-20 17:00:00+07	\N	Biệt thự Phú Mỹ Hưng - Quận 7, TP.HCM	Công ty PQR	0901000111	741 Đường S, Phú Mỹ Hưng, TP.HCM	10.73000000	106.70000000	12.00	\N	9999999.99	\N	unpaid	t	\N	2025-12-20 17:00:00+07	2025-12-20 17:00:00+07	\N
\.


--
-- Name: attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.attachments_id_seq', 1, false);


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.attendance_id_seq', 1, false);


--
-- Name: attendance_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.attendance_locations_id_seq', 2, true);


--
-- Name: attendance_session_histories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.attendance_session_histories_id_seq', 1, false);


--
-- Name: attendance_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.attendance_sessions_id_seq', 1, false);


--
-- Name: attendance_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.attendance_type_id_seq', 1, false);


--
-- Name: attendance_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.attendance_types_id_seq', 1, false);


--
-- Name: check_in_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.check_in_types_id_seq', 1, false);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.customers_id_seq', 20, true);


--
-- Name: dashboard_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.dashboard_metrics_id_seq', 1, false);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.departments_id_seq', 5, true);


--
-- Name: location_histories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.location_histories_id_seq', 1, false);


--
-- Name: material_usages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.material_usages_id_seq', 1, false);


--
-- Name: materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.materials_id_seq', 1, false);


--
-- Name: notification_recipients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.notification_recipients_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: office_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.office_locations_id_seq', 1, false);


--
-- Name: performance_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.performance_metrics_id_seq', 1, false);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.permissions_id_seq', 1, false);


--
-- Name: position_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.position_roles_id_seq', 1, false);


--
-- Name: positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.positions_id_seq', 19, true);


--
-- Name: project_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.project_history_id_seq', 1, false);


--
-- Name: project_team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.project_team_members_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.projects_id_seq', 1, false);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.role_permissions_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: sales_report_daily_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.sales_report_daily_id_seq', 1, false);


--
-- Name: system_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.system_config_id_seq', 1, false);


--
-- Name: system_configs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.system_configs_id_seq', 1, false);


--
-- Name: technician_skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.technician_skills_id_seq', 1, false);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- Name: work_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.work_assignments_id_seq', 1, false);


--
-- Name: work_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.work_categories_id_seq', 10, true);


--
-- Name: work_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.work_history_id_seq', 1, false);


--
-- Name: work_materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.work_materials_id_seq', 1, false);


--
-- Name: work_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.work_reports_id_seq', 8, true);


--
-- Name: works_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ims_root
--

SELECT pg_catalog.setval('public.works_id_seq', 10, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
-- Name: attendance_locations attendance_locations_location_code_key; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_locations
    ADD CONSTRAINT attendance_locations_location_code_key UNIQUE (location_code);


--
-- Name: attendance_locations attendance_locations_location_code_key1; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_locations
    ADD CONSTRAINT attendance_locations_location_code_key1 UNIQUE (location_code);


--
-- Name: attendance_locations attendance_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_locations
    ADD CONSTRAINT attendance_locations_pkey PRIMARY KEY (id);


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: attendance_session_histories attendance_session_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_session_histories
    ADD CONSTRAINT attendance_session_histories_pkey PRIMARY KEY (id);


--
-- Name: attendance_sessions attendance_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT attendance_sessions_pkey PRIMARY KEY (id);


--
-- Name: attendance_technicians attendance_technicians_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_technicians
    ADD CONSTRAINT attendance_technicians_pkey PRIMARY KEY (attendance_id, user_id);


--
-- Name: attendance_type attendance_type_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_type
    ADD CONSTRAINT attendance_type_pkey PRIMARY KEY (id);


--
-- Name: attendance_types attendance_types_code_key; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_types
    ADD CONSTRAINT attendance_types_code_key UNIQUE (code);


--
-- Name: attendance_types attendance_types_code_key1; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_types
    ADD CONSTRAINT attendance_types_code_key1 UNIQUE (code);


--
-- Name: attendance_types attendance_types_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_types
    ADD CONSTRAINT attendance_types_pkey PRIMARY KEY (id);


--
-- Name: check_in_types check_in_types_code_key; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.check_in_types
    ADD CONSTRAINT check_in_types_code_key UNIQUE (code);


--
-- Name: check_in_types check_in_types_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.check_in_types
    ADD CONSTRAINT check_in_types_pkey PRIMARY KEY (id);


--
-- Name: customers customers_customer_code_key; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_customer_code_key UNIQUE (customer_code);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: dashboard_metrics dashboard_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.dashboard_metrics
    ADD CONSTRAINT dashboard_metrics_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: employee_profiles employee_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.employee_profiles
    ADD CONSTRAINT employee_profiles_pkey PRIMARY KEY (user_id);


--
-- Name: location_histories location_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.location_histories
    ADD CONSTRAINT location_histories_pkey PRIMARY KEY (id);


--
-- Name: material_usages material_usages_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.material_usages
    ADD CONSTRAINT material_usages_pkey PRIMARY KEY (id);


--
-- Name: materials materials_code_key; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_code_key UNIQUE (code);


--
-- Name: materials materials_material_code_key; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_material_code_key UNIQUE (material_code);


--
-- Name: materials materials_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_pkey PRIMARY KEY (id);


--
-- Name: notification_recipients notification_recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.notification_recipients
    ADD CONSTRAINT notification_recipients_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: office_locations office_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.office_locations
    ADD CONSTRAINT office_locations_pkey PRIMARY KEY (id);


--
-- Name: performance_metrics performance_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.performance_metrics
    ADD CONSTRAINT performance_metrics_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: position_roles position_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.position_roles
    ADD CONSTRAINT position_roles_pkey PRIMARY KEY (id);


--
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);


--
-- Name: project_history project_history_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.project_history
    ADD CONSTRAINT project_history_pkey PRIMARY KEY (id);


--
-- Name: project_members project_members_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_pkey PRIMARY KEY (project_id, user_id);


--
-- Name: project_team_members project_team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.project_team_members
    ADD CONSTRAINT project_team_members_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sales_report_daily sales_report_daily_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.sales_report_daily
    ADD CONSTRAINT sales_report_daily_pkey PRIMARY KEY (id);


--
-- Name: sales_report_daily sales_report_daily_report_code_key; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.sales_report_daily
    ADD CONSTRAINT sales_report_daily_report_code_key UNIQUE (report_code);


--
-- Name: system_config system_config_config_key_key; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.system_config
    ADD CONSTRAINT system_config_config_key_key UNIQUE (config_key);


--
-- Name: system_config system_config_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.system_config
    ADD CONSTRAINT system_config_pkey PRIMARY KEY (id);


--
-- Name: system_configs system_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.system_configs
    ADD CONSTRAINT system_configs_pkey PRIMARY KEY (id);


--
-- Name: technician_skills technician_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.technician_skills
    ADD CONSTRAINT technician_skills_pkey PRIMARY KEY (id);


--
-- Name: technician_skills unique_technician_level; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.technician_skills
    ADD CONSTRAINT unique_technician_level UNIQUE (technician_id, technician_level);


--
-- Name: work_materials uq_work_materials_work_material; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_materials
    ADD CONSTRAINT uq_work_materials_work_material UNIQUE (work_code, material_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: work_assignments work_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_assignments
    ADD CONSTRAINT work_assignments_pkey PRIMARY KEY (id);


--
-- Name: work_categories work_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_categories
    ADD CONSTRAINT work_categories_pkey PRIMARY KEY (id);


--
-- Name: work_history work_history_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_history
    ADD CONSTRAINT work_history_pkey PRIMARY KEY (id);


--
-- Name: work_materials work_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_materials
    ADD CONSTRAINT work_materials_pkey PRIMARY KEY (id);


--
-- Name: work_reports work_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_reports
    ADD CONSTRAINT work_reports_pkey PRIMARY KEY (id);


--
-- Name: works works_pkey; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT works_pkey PRIMARY KEY (id);


--
-- Name: works works_work_code_key; Type: CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT works_work_code_key UNIQUE (work_code);


--
-- Name: attachments_report_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attachments_report_id ON public.attachments USING btree (report_id);


--
-- Name: attachments_uploaded_at; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attachments_uploaded_at ON public.attachments USING btree (uploaded_at);


--
-- Name: attachments_uploaded_by; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attachments_uploaded_by ON public.attachments USING btree (uploaded_by);


--
-- Name: attachments_work_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attachments_work_id ON public.attachments USING btree (work_id);


--
-- Name: attendance_attendance_session_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_attendance_session_id ON public.attendance USING btree (attendance_session_id);


--
-- Name: attendance_check_in_time; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_check_in_time ON public.attendance USING btree (check_in_time);


--
-- Name: attendance_check_in_type_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_check_in_type_id ON public.attendance USING btree (check_in_type_id);


--
-- Name: attendance_is_within_radius; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_is_within_radius ON public.attendance USING btree (is_within_radius);


--
-- Name: attendance_latitude_longitude; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_latitude_longitude ON public.attendance USING btree (latitude, longitude);


--
-- Name: attendance_locations_is_active; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_locations_is_active ON public.attendance_locations USING btree (is_active);


--
-- Name: attendance_locations_latitude_longitude; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_locations_latitude_longitude ON public.attendance_locations USING btree (latitude, longitude);


--
-- Name: attendance_locations_location_code; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX attendance_locations_location_code ON public.attendance_locations USING btree (location_code);


--
-- Name: attendance_locations_type; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_locations_type ON public.attendance_locations USING btree (type);


--
-- Name: attendance_parent_attendance_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_parent_attendance_id ON public.attendance USING btree (parent_attendance_id);


--
-- Name: attendance_project_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_project_id ON public.attendance USING btree (project_id);


--
-- Name: attendance_project_id_check_in_time; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_project_id_check_in_time ON public.attendance USING btree (project_id, check_in_time);


--
-- Name: attendance_session_histories_archived_at; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_session_histories_archived_at ON public.attendance_session_histories USING btree (archived_at);


--
-- Name: attendance_session_histories_original_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_session_histories_original_id ON public.attendance_session_histories USING btree (original_id);


--
-- Name: attendance_session_histories_project_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_session_histories_project_id ON public.attendance_session_histories USING btree (project_id);


--
-- Name: attendance_session_histories_user_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_session_histories_user_id ON public.attendance_session_histories USING btree (user_id);


--
-- Name: attendance_session_histories_work_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_session_histories_work_id ON public.attendance_session_histories USING btree (work_id);


--
-- Name: attendance_sessions_ended_at; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_sessions_ended_at ON public.attendance_sessions USING btree (ended_at);


--
-- Name: attendance_sessions_started_at; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_sessions_started_at ON public.attendance_sessions USING btree (started_at);


--
-- Name: attendance_sessions_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_sessions_status ON public.attendance_sessions USING btree (status);


--
-- Name: attendance_sessions_user_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_sessions_user_id ON public.attendance_sessions USING btree (user_id);


--
-- Name: attendance_sessions_work_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_sessions_work_id ON public.attendance_sessions USING btree (work_id);


--
-- Name: attendance_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_status ON public.attendance USING btree (status);


--
-- Name: attendance_types_code; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX attendance_types_code ON public.attendance_types USING btree (code);


--
-- Name: attendance_types_is_active; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_types_is_active ON public.attendance_types USING btree (is_active);


--
-- Name: attendance_user_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_user_id ON public.attendance USING btree (user_id);


--
-- Name: attendance_user_id_check_in_time; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_user_id_check_in_time ON public.attendance USING btree (user_id, check_in_time);


--
-- Name: attendance_work_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_work_id ON public.attendance USING btree (work_id);


--
-- Name: attendance_work_id_check_in_time; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX attendance_work_id_check_in_time ON public.attendance USING btree (work_id, check_in_time);


--
-- Name: customers_account_manager_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX customers_account_manager_id ON public.customers USING btree (account_manager_id);


--
-- Name: customers_customer_code; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX customers_customer_code ON public.customers USING btree (customer_code);


--
-- Name: customers_customer_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX customers_customer_status ON public.customers USING btree (customer_status);


--
-- Name: customers_customer_type; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX customers_customer_type ON public.customers USING btree (customer_type);


--
-- Name: customers_email; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX customers_email ON public.customers USING btree (email);


--
-- Name: customers_is_active; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX customers_is_active ON public.customers USING btree (is_active);


--
-- Name: customers_name; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX customers_name ON public.customers USING btree (name);


--
-- Name: customers_phone; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX customers_phone ON public.customers USING btree (phone);


--
-- Name: dashboard_metrics_metric_type; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX dashboard_metrics_metric_type ON public.dashboard_metrics USING btree (metric_type);


--
-- Name: dashboard_metrics_user_id_metric_date; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX dashboard_metrics_user_id_metric_date ON public.dashboard_metrics USING btree (user_id, metric_date);


--
-- Name: departments_is_deleted; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX departments_is_deleted ON public.departments USING btree (is_deleted);


--
-- Name: departments_manager_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX departments_manager_id ON public.departments USING btree (manager_id);


--
-- Name: departments_parent_department_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX departments_parent_department_id ON public.departments USING btree (parent_department_id);


--
-- Name: departments_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX departments_status ON public.departments USING btree (status);


--
-- Name: employee_profiles_is_active; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX employee_profiles_is_active ON public.employee_profiles USING btree (is_active);


--
-- Name: employee_profiles_user_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX employee_profiles_user_id ON public.employee_profiles USING btree (user_id);


--
-- Name: idx_attendance_types_code_unique; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX idx_attendance_types_code_unique ON public.attendance_types USING btree (code);


--
-- Name: idx_attendance_types_is_active; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX idx_attendance_types_is_active ON public.attendance_types USING btree (is_active);


--
-- Name: idx_department_deleted; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX idx_department_deleted ON public.departments USING btree (is_deleted);


--
-- Name: idx_department_manager; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX idx_department_manager ON public.departments USING btree (manager_id);


--
-- Name: idx_department_parent; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX idx_department_parent ON public.departments USING btree (parent_department_id);


--
-- Name: idx_department_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX idx_department_status ON public.departments USING btree (status);


--
-- Name: idx_employee_profile_dept; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX idx_employee_profile_dept ON public.employee_profiles USING btree (department_id);


--
-- Name: idx_material_usages_material_work; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX idx_material_usages_material_work ON public.material_usages USING btree (material_id, work_code);


--
-- Name: idx_work_materials_work_material; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX idx_work_materials_work_material ON public.work_materials USING btree (work_code, material_id);


--
-- Name: location_histories_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX location_histories_status ON public.location_histories USING btree (status);


--
-- Name: location_histories_timestamp; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX location_histories_timestamp ON public.location_histories USING btree ("timestamp");


--
-- Name: location_histories_user_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX location_histories_user_id ON public.location_histories USING btree (user_id);


--
-- Name: location_histories_user_id_timestamp; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX location_histories_user_id_timestamp ON public.location_histories USING btree (user_id, "timestamp");


--
-- Name: material_usages_material_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX material_usages_material_id ON public.material_usages USING btree (material_id);


--
-- Name: material_usages_technician_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX material_usages_technician_id ON public.material_usages USING btree (technician_id);


--
-- Name: material_usages_usage_type; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX material_usages_usage_type ON public.material_usages USING btree (usage_type);


--
-- Name: material_usages_work_code; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX material_usages_work_code ON public.material_usages USING btree (work_code);


--
-- Name: materials_code; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX materials_code ON public.materials USING btree (code);


--
-- Name: materials_material_code; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX materials_material_code ON public.materials USING btree (material_code);


--
-- Name: materials_name; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX materials_name ON public.materials USING btree (name);


--
-- Name: materials_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX materials_status ON public.materials USING btree (status);


--
-- Name: notification_recipients_notification_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX notification_recipients_notification_id ON public.notification_recipients USING btree (notification_id);


--
-- Name: notification_recipients_user_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX notification_recipients_user_id ON public.notification_recipients USING btree (user_id);


--
-- Name: notification_recipients_user_id_is_read; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX notification_recipients_user_id_is_read ON public.notification_recipients USING btree (user_id, is_read);


--
-- Name: notifications_created_at; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX notifications_created_at ON public.notifications USING btree (created_at);


--
-- Name: notifications_is_system; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX notifications_is_system ON public.notifications USING btree (is_system);


--
-- Name: notifications_priority; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX notifications_priority ON public.notifications USING btree (priority);


--
-- Name: notifications_related_project_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX notifications_related_project_id ON public.notifications USING btree (related_project_id);


--
-- Name: notifications_type; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX notifications_type ON public.notifications USING btree (type);


--
-- Name: office_locations_is_active; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX office_locations_is_active ON public.office_locations USING btree (is_active);


--
-- Name: office_locations_latitude_longitude; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX office_locations_latitude_longitude ON public.office_locations USING btree (latitude, longitude);


--
-- Name: office_locations_type; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX office_locations_type ON public.office_locations USING btree (type);


--
-- Name: performance_metrics_month; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX performance_metrics_month ON public.performance_metrics USING btree (month);


--
-- Name: performance_metrics_user_id_month; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX performance_metrics_user_id_month ON public.performance_metrics USING btree (user_id, month);


--
-- Name: permissions_category; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX permissions_category ON public.permissions USING btree (category);


--
-- Name: permissions_code_is_deleted; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX permissions_code_is_deleted ON public.permissions USING btree (code, is_deleted);


--
-- Name: permissions_is_deleted; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX permissions_is_deleted ON public.permissions USING btree (is_deleted);


--
-- Name: position_roles_is_default; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX position_roles_is_default ON public.position_roles USING btree (is_default);


--
-- Name: position_roles_position_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX position_roles_position_id ON public.position_roles USING btree (position_id);


--
-- Name: position_roles_priority; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX position_roles_priority ON public.position_roles USING btree (priority);


--
-- Name: position_roles_role_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX position_roles_role_id ON public.position_roles USING btree (role_id);


--
-- Name: positions_created_by; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX positions_created_by ON public.positions USING btree (created_by);


--
-- Name: positions_department_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX positions_department_id ON public.positions USING btree (department_id);


--
-- Name: positions_is_deleted; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX positions_is_deleted ON public.positions USING btree (is_deleted);


--
-- Name: positions_level; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX positions_level ON public.positions USING btree (level);


--
-- Name: positions_parent_position_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX positions_parent_position_id ON public.positions USING btree (parent_position_id);


--
-- Name: positions_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX positions_status ON public.positions USING btree (status);


--
-- Name: positions_updated_by; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX positions_updated_by ON public.positions USING btree (updated_by);


--
-- Name: project_history_action; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX project_history_action ON public.project_history USING btree (action);


--
-- Name: project_history_changed_at; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX project_history_changed_at ON public.project_history USING btree (changed_at);


--
-- Name: project_history_changed_by; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX project_history_changed_by ON public.project_history USING btree (changed_by);


--
-- Name: project_history_field_changed; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX project_history_field_changed ON public.project_history USING btree (field_changed);


--
-- Name: project_history_project_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX project_history_project_id ON public.project_history USING btree (project_id);


--
-- Name: project_team_members_project_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX project_team_members_project_id ON public.project_team_members USING btree (project_id);


--
-- Name: project_team_members_user_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX project_team_members_user_id ON public.project_team_members USING btree (user_id);


--
-- Name: projects_completed_tasks; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX projects_completed_tasks ON public.projects USING btree (completed_tasks);


--
-- Name: projects_consumed_manpower; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX projects_consumed_manpower ON public.projects USING btree (consumed_manpower);


--
-- Name: projects_created_by; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX projects_created_by ON public.projects USING btree (created_by);


--
-- Name: projects_end_date; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX projects_end_date ON public.projects USING btree (end_date);


--
-- Name: projects_manager_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX projects_manager_id ON public.projects USING btree (manager_id);


--
-- Name: projects_name; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX projects_name ON public.projects USING btree (name);


--
-- Name: projects_overdue_tasks; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX projects_overdue_tasks ON public.projects USING btree (overdue_tasks);


--
-- Name: projects_pending_reports; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX projects_pending_reports ON public.projects USING btree (pending_reports);


--
-- Name: projects_planned_manpower; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX projects_planned_manpower ON public.projects USING btree (planned_manpower);


--
-- Name: projects_priority; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX projects_priority ON public.projects USING btree (priority);


--
-- Name: projects_start_date; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX projects_start_date ON public.projects USING btree (start_date);


--
-- Name: projects_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX projects_status ON public.projects USING btree (status);


--
-- Name: projects_total_tasks; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX projects_total_tasks ON public.projects USING btree (total_tasks);


--
-- Name: role_permissions_permission_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX role_permissions_permission_id ON public.role_permissions USING btree (permission_id);


--
-- Name: role_permissions_role_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX role_permissions_role_id ON public.role_permissions USING btree (role_id);


--
-- Name: roles_created_at; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX roles_created_at ON public.roles USING btree (created_at);


--
-- Name: roles_created_by; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX roles_created_by ON public.roles USING btree (created_by);


--
-- Name: roles_is_deleted; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX roles_is_deleted ON public.roles USING btree (is_deleted);


--
-- Name: roles_level; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX roles_level ON public.roles USING btree (level);


--
-- Name: roles_name_is_deleted; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX roles_name_is_deleted ON public.roles USING btree (name, is_deleted);


--
-- Name: roles_updated_by; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX roles_updated_by ON public.roles USING btree (updated_by);


--
-- Name: sales_report_daily_created_at; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX sales_report_daily_created_at ON public.sales_report_daily USING btree (created_at);


--
-- Name: sales_report_daily_report_date; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX sales_report_daily_report_date ON public.sales_report_daily USING btree (report_date);


--
-- Name: sales_report_daily_sales_person_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX sales_report_daily_sales_person_id ON public.sales_report_daily USING btree (sales_person_id);


--
-- Name: sales_report_daily_sales_person_id_report_date; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX sales_report_daily_sales_person_id_report_date ON public.sales_report_daily USING btree (sales_person_id, report_date);


--
-- Name: system_config_config_key; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX system_config_config_key ON public.system_config USING btree (config_key);


--
-- Name: system_configs_updated_at; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX system_configs_updated_at ON public.system_configs USING btree (updated_at);


--
-- Name: system_configs_updated_by; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX system_configs_updated_by ON public.system_configs USING btree (updated_by);


--
-- Name: technician_skills_technician_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX technician_skills_technician_id ON public.technician_skills USING btree (technician_id);


--
-- Name: technician_skills_technician_level; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX technician_skills_technician_level ON public.technician_skills USING btree (technician_level);


--
-- Name: uniq_notification_recipient; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX uniq_notification_recipient ON public.notification_recipients USING btree (notification_id, user_id);


--
-- Name: uniq_works_work_code; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX uniq_works_work_code ON public.works USING btree (work_code);


--
-- Name: unique_department_code_deleted; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX unique_department_code_deleted ON public.departments USING btree (code, is_deleted);


--
-- Name: unique_department_name_deleted; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX unique_department_name_deleted ON public.departments USING btree (name, is_deleted);


--
-- Name: unique_position_code_deleted; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX unique_position_code_deleted ON public.positions USING btree (code, is_deleted);


--
-- Name: unique_position_name_department_deleted; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX unique_position_name_department_deleted ON public.positions USING btree (name, department_id, is_deleted);


--
-- Name: unique_position_role; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX unique_position_role ON public.position_roles USING btree (position_id, role_id);


--
-- Name: unique_role_permission_index; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX unique_role_permission_index ON public.role_permissions USING btree (role_id, permission_id);


--
-- Name: unique_user_role_index; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX unique_user_role_index ON public.user_roles USING btree (user_id, role_id);


--
-- Name: unique_work_technician; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX unique_work_technician ON public.work_assignments USING btree (work_id, technician_id);


--
-- Name: user_roles_role_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX user_roles_role_id ON public.user_roles USING btree (role_id);


--
-- Name: user_roles_user_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: users_email; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX users_email ON public.users USING btree (email);


--
-- Name: users_employee_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX users_employee_id ON public.users USING btree (employee_id);


--
-- Name: users_is_active; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX users_is_active ON public.users USING btree (is_active);


--
-- Name: users_manager_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX users_manager_id ON public.users USING btree (manager_id);


--
-- Name: users_position_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX users_position_id ON public.users USING btree (position_id);


--
-- Name: work_assignments_assigned_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_assignments_assigned_status ON public.work_assignments USING btree (assigned_status);


--
-- Name: work_assignments_assignment_date; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_assignments_assignment_date ON public.work_assignments USING btree (assignment_date);


--
-- Name: work_assignments_technician_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_assignments_technician_id ON public.work_assignments USING btree (technician_id);


--
-- Name: work_assignments_work_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_assignments_work_id ON public.work_assignments USING btree (work_id);


--
-- Name: work_categories_is_active; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_categories_is_active ON public.work_categories USING btree (is_active);


--
-- Name: work_categories_name; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE UNIQUE INDEX work_categories_name ON public.work_categories USING btree (name);


--
-- Name: work_history_action; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_history_action ON public.work_history USING btree (action);


--
-- Name: work_history_changed_at; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_history_changed_at ON public.work_history USING btree (changed_at);


--
-- Name: work_history_changed_by; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_history_changed_by ON public.work_history USING btree (changed_by);


--
-- Name: work_history_field_changed; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_history_field_changed ON public.work_history USING btree (field_changed);


--
-- Name: work_history_work_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_history_work_id ON public.work_history USING btree (work_id);


--
-- Name: work_materials_material_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_materials_material_id ON public.work_materials USING btree (material_id);


--
-- Name: work_materials_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_materials_status ON public.work_materials USING btree (status);


--
-- Name: work_materials_technician_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_materials_technician_id ON public.work_materials USING btree (technician_id);


--
-- Name: work_materials_work_code; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_materials_work_code ON public.work_materials USING btree (work_code);


--
-- Name: work_materials_work_code_material_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_materials_work_code_material_id ON public.work_materials USING btree (work_code, material_id);


--
-- Name: work_reports_approval_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_reports_approval_status ON public.work_reports USING btree (approval_status);


--
-- Name: work_reports_assigned_approver; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_reports_assigned_approver ON public.work_reports USING btree (assigned_approver);


--
-- Name: work_reports_project_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_reports_project_id ON public.work_reports USING btree (project_id);


--
-- Name: work_reports_quality_rating; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_reports_quality_rating ON public.work_reports USING btree (quality_rating);


--
-- Name: work_reports_reported_at; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_reports_reported_at ON public.work_reports USING btree (reported_at);


--
-- Name: work_reports_reported_by; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_reports_reported_by ON public.work_reports USING btree (reported_by);


--
-- Name: work_reports_work_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX work_reports_work_id ON public.work_reports USING btree (work_id);


--
-- Name: works_category_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX works_category_id ON public.works USING btree (category_id);


--
-- Name: works_created_by_sales_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX works_created_by_sales_id ON public.works USING btree (created_by_sales_id);


--
-- Name: works_created_date; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX works_created_date ON public.works USING btree (created_date);


--
-- Name: works_customer_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX works_customer_id ON public.works USING btree (customer_id);


--
-- Name: works_due_date; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX works_due_date ON public.works USING btree (due_date);


--
-- Name: works_payment_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX works_payment_status ON public.works USING btree (payment_status);


--
-- Name: works_priority; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX works_priority ON public.works USING btree (priority);


--
-- Name: works_project_id; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX works_project_id ON public.works USING btree (project_id);


--
-- Name: works_required_date; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX works_required_date ON public.works USING btree (required_date);


--
-- Name: works_status; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX works_status ON public.works USING btree (status);


--
-- Name: works_time_slot; Type: INDEX; Schema: public; Owner: ims_root
--

CREATE INDEX works_time_slot ON public.works USING btree ("timeSlot");


--
-- Name: attendance_type trg_set_default_duration; Type: TRIGGER; Schema: public; Owner: ims_root
--

CREATE TRIGGER trg_set_default_duration BEFORE INSERT OR UPDATE ON public.attendance_type FOR EACH ROW EXECUTE FUNCTION public.set_check_in_type_default_duration();


--
-- Name: check_in_types trg_set_default_duration; Type: TRIGGER; Schema: public; Owner: ims_root
--

CREATE TRIGGER trg_set_default_duration BEFORE INSERT OR UPDATE ON public.check_in_types FOR EACH ROW EXECUTE FUNCTION public.set_check_in_type_default_duration();


--
-- Name: attachments attachments_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.work_reports(id) ON UPDATE CASCADE;


--
-- Name: attachments attachments_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: attachments attachments_work_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_work_id_fkey FOREIGN KEY (work_id) REFERENCES public.works(id) ON UPDATE CASCADE;


--
-- Name: attendance attendance_attendance_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_attendance_session_id_fkey FOREIGN KEY (attendance_session_id) REFERENCES public.attendance_sessions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance attendance_check_in_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_check_in_type_id_fkey FOREIGN KEY (check_in_type_id) REFERENCES public.attendance_type(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance attendance_parent_attendance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_parent_attendance_id_fkey FOREIGN KEY (parent_attendance_id) REFERENCES public.attendance(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance attendance_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance_session_histories attendance_session_histories_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_session_histories
    ADD CONSTRAINT attendance_session_histories_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance_session_histories attendance_session_histories_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_session_histories
    ADD CONSTRAINT attendance_session_histories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: attendance_session_histories attendance_session_histories_work_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_session_histories
    ADD CONSTRAINT attendance_session_histories_work_id_fkey FOREIGN KEY (work_id) REFERENCES public.works(id) ON UPDATE CASCADE;


--
-- Name: attendance_sessions attendance_sessions_check_in_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT attendance_sessions_check_in_id_fkey FOREIGN KEY (check_in_id) REFERENCES public.attendance(id) ON UPDATE CASCADE;


--
-- Name: attendance_sessions attendance_sessions_check_out_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT attendance_sessions_check_out_id_fkey FOREIGN KEY (check_out_id) REFERENCES public.attendance(id) ON UPDATE CASCADE;


--
-- Name: attendance_sessions attendance_sessions_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT attendance_sessions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance_sessions attendance_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT attendance_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: attendance_sessions attendance_sessions_work_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT attendance_sessions_work_id_fkey FOREIGN KEY (work_id) REFERENCES public.works(id) ON UPDATE CASCADE;


--
-- Name: attendance attendance_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: attendance attendance_work_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_work_id_fkey FOREIGN KEY (work_id) REFERENCES public.works(id) ON UPDATE CASCADE;


--
-- Name: customers customers_account_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_account_manager_id_fkey FOREIGN KEY (account_manager_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: customers customers_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: dashboard_metrics dashboard_metrics_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.dashboard_metrics
    ADD CONSTRAINT dashboard_metrics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: departments departments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: departments departments_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: departments departments_parent_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_parent_department_id_fkey FOREIGN KEY (parent_department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: departments departments_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: employee_profiles employee_profiles_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.employee_profiles
    ADD CONSTRAINT employee_profiles_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employee_profiles employee_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.employee_profiles
    ADD CONSTRAINT employee_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: location_histories location_histories_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.location_histories
    ADD CONSTRAINT location_histories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: material_usages material_usages_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.material_usages
    ADD CONSTRAINT material_usages_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: material_usages material_usages_technician_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.material_usages
    ADD CONSTRAINT material_usages_technician_id_fkey FOREIGN KEY (technician_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: material_usages material_usages_work_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.material_usages
    ADD CONSTRAINT material_usages_work_code_fkey FOREIGN KEY (work_code) REFERENCES public.works(work_code) ON UPDATE CASCADE;


--
-- Name: materials materials_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: notification_recipients notification_recipients_notification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.notification_recipients
    ADD CONSTRAINT notification_recipients_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification_recipients notification_recipients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.notification_recipients
    ADD CONSTRAINT notification_recipients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: notifications notifications_related_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_related_project_id_fkey FOREIGN KEY (related_project_id) REFERENCES public.projects(id) ON UPDATE CASCADE;


--
-- Name: notifications notifications_related_work_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_related_work_id_fkey FOREIGN KEY (related_work_id) REFERENCES public.works(id) ON UPDATE CASCADE;


--
-- Name: performance_metrics performance_metrics_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.performance_metrics
    ADD CONSTRAINT performance_metrics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: position_roles position_roles_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.position_roles
    ADD CONSTRAINT position_roles_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: position_roles position_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.position_roles
    ADD CONSTRAINT position_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: positions positions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: positions positions_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: positions positions_parent_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_parent_position_id_fkey FOREIGN KEY (parent_position_id) REFERENCES public.positions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: positions positions_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: project_history project_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.project_history
    ADD CONSTRAINT project_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: project_history project_history_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.project_history
    ADD CONSTRAINT project_history_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE;


--
-- Name: project_team_members project_team_members_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.project_team_members
    ADD CONSTRAINT project_team_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_team_members project_team_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.project_team_members
    ADD CONSTRAINT project_team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: projects projects_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: projects projects_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: roles roles_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: roles roles_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: sales_report_daily sales_report_daily_sales_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.sales_report_daily
    ADD CONSTRAINT sales_report_daily_sales_person_id_fkey FOREIGN KEY (sales_person_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: system_config system_config_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.system_config
    ADD CONSTRAINT system_config_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: system_configs system_configs_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.system_configs
    ADD CONSTRAINT system_configs_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: technician_skills technician_skills_technician_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.technician_skills
    ADD CONSTRAINT technician_skills_technician_id_fkey FOREIGN KEY (technician_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: user_roles user_roles_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: users users_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: work_assignments work_assignments_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_assignments
    ADD CONSTRAINT work_assignments_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_assignments work_assignments_technician_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_assignments
    ADD CONSTRAINT work_assignments_technician_id_fkey FOREIGN KEY (technician_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_assignments work_assignments_work_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_assignments
    ADD CONSTRAINT work_assignments_work_id_fkey FOREIGN KEY (work_id) REFERENCES public.works(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_history work_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_history
    ADD CONSTRAINT work_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_history work_history_work_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_history
    ADD CONSTRAINT work_history_work_id_fkey FOREIGN KEY (work_id) REFERENCES public.works(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_materials work_materials_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_materials
    ADD CONSTRAINT work_materials_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_materials work_materials_technician_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_materials
    ADD CONSTRAINT work_materials_technician_id_fkey FOREIGN KEY (technician_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: work_materials work_materials_work_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_materials
    ADD CONSTRAINT work_materials_work_code_fkey FOREIGN KEY (work_code) REFERENCES public.works(work_code) ON UPDATE CASCADE;


--
-- Name: work_reports work_reports_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_reports
    ADD CONSTRAINT work_reports_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: work_reports work_reports_assigned_approver_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_reports
    ADD CONSTRAINT work_reports_assigned_approver_fkey FOREIGN KEY (assigned_approver) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: work_reports work_reports_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_reports
    ADD CONSTRAINT work_reports_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: work_reports work_reports_reported_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_reports
    ADD CONSTRAINT work_reports_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_reports work_reports_work_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.work_reports
    ADD CONSTRAINT work_reports_work_id_fkey FOREIGN KEY (work_id) REFERENCES public.works(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: works works_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT works_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.work_categories(id) ON UPDATE CASCADE;


--
-- Name: works works_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT works_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: works works_created_by_sales_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT works_created_by_sales_id_fkey FOREIGN KEY (created_by_sales_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: works works_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT works_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: works works_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ims_root
--

ALTER TABLE ONLY public.works
    ADD CONSTRAINT works_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict LgcMjlNKP15jf6iJXwl8ddrzpUHXSiA30ozcaRlC3gAwBr6Ky8JbGmrvrvlgguC

